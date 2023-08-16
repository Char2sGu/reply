import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ProjectionNodeDirective } from '@layout-projection/angular';
import {
  LayoutAnimator,
  ProjectionNode,
  ProjectionNodeSnapper,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';
import { Store } from '@ngrx/store';
import {
  animationFrames,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  of,
  pairwise,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

import { VirtualMailboxName } from '../core/mailbox-name.enums';
import { MAIL_ACTIONS } from '../entity/mail/mail.actions';
import { Mail } from '../entity/mail/mail.model';
import { MAIL_STATE } from '../state/mail/mail.state-entry';
import { MAILBOX_STATE } from '../state/mailbox/mailbox.state-entry';
import { MailCardAnimationPresenceComponent } from './core/mail-card-animation-presence/mail-card-animation-presence.component';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective],
})
export class MailsComponent implements AfterViewInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private hostNode = inject(ProjectionNode);
  private layoutSnapper = inject(ProjectionNodeSnapper);
  private layoutAnimator = inject(LayoutAnimator);
  private viewContainer = inject(ViewContainerRef);

  mailId$ = this.route.params.pipe(map((p) => p['mailId']));
  mail$ = combineLatest([
    this.mailId$,
    this.store.select(MAIL_STATE.selectMails),
  ]).pipe(
    map(([id, mails]) => {
      if (!id) return null;
      return mails.retrieve(id);
    }),
    shareReplay(1),
  );

  mailboxName$ = this.route.params.pipe(map((p): string => p['mailboxName']));
  mailbox$ = this.mailboxName$.pipe(
    switchMap((mailboxName) =>
      Object.values(VirtualMailboxName).includes(mailboxName as any)
        ? of(mailboxName as VirtualMailboxName)
        : this.store.select(MAILBOX_STATE.selectMailboxes).pipe(
            map((mailboxes) => {
              const result = mailboxes.queryOne((m) => m.name === mailboxName);
              if (!result) throw new Error(`Missing mailbox ${mailboxName}`);
              return result;
            }),
          ),
    ),
  );

  @ViewChild('listLayoutNode') private listLayoutNode!: ProjectionNode;
  private listLayoutSnapshots = new ProjectionNodeSnapshotMap();
  @ViewChild('detailLayoutNode') private detailLayoutNode?: ProjectionNode;
  private detailLayoutSnapshots = new ProjectionNodeSnapshotMap();

  private destroy$ = new EventEmitter();

  constructor() {
    inject(ProjectionNode, { self: true }).identifyAs('mails');
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        this.updateSnapshots();
      });

    this.mail$
      .pipe(
        pairwise(),
        map(([prev, curr]) => (!prev && !!curr ? curr : null)),
        filter(Boolean),
        switchMap(async (mail) => {
          await this.initiateListToDetailLayoutAnimation();
          if (mail.isRead) return;
          const act = MAIL_ACTIONS.toggleMailReadStatus({ mail, to: 'read' });
          this.store.dispatch(act);
        }),
      )
      .subscribe();

    this.mail$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => !!prev && !curr),
        map(([mail]) => mail as Mail),
        switchMap((mail) => this.initiateDetailToListLayoutAnimation(mail)),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  updateSnapshots(): void {
    this.listLayoutSnapshots = this.layoutSnapper.snapshotTree(
      this.listLayoutNode, //
      { measure: true },
    );
    if (this.detailLayoutNode)
      this.detailLayoutSnapshots = this.layoutSnapper.snapshotTree(
        this.detailLayoutNode, //
        { measure: true },
      );
  }

  async initiateListToDetailLayoutAnimation(): Promise<void> {
    await firstValueFrom(animationFrames());
    await this.layoutAnimator.animate({
      root: this.hostNode,
      from: this.listLayoutSnapshots,
      duration: 250,
      easing: AnimationCurves.STANDARD_CURVE,
      estimation: true,
    });
  }

  async initiateDetailToListLayoutAnimation(mail: Mail): Promise<void> {
    const snapshot = this.listLayoutSnapshots.get(`mail-${mail.id}`);
    if (!snapshot) return; // mail removed from the current mailbox

    const cardType = MailCardAnimationPresenceComponent;
    const cardRef = this.viewContainer.createComponent(cardType);
    cardRef.setInput('mail', mail);

    const cardEle: HTMLElement = cardRef.location.nativeElement;
    cardEle.style.position = 'fixed';
    cardEle.style.top = snapshot.boundingBox.top + 'px';
    cardEle.style.left = snapshot.boundingBox.left + 'px';
    cardEle.style.width = snapshot.boundingBox.width() + 'px';
    cardEle.style.height = snapshot.boundingBox.height() + 'px';

    await firstValueFrom(animationFrames());

    const cardNode = await firstValueFrom(cardRef.instance.node$);
    cardNode.identifyAs(`mail-${mail.id}`);
    cardNode.attach(this.hostNode);
    this.listLayoutNode.deactivate();

    await this.layoutAnimator.animate({
      root: this.hostNode,
      from: this.detailLayoutSnapshots,
      duration: 250,
      easing: AnimationCurves.STANDARD_CURVE,
      estimation: true,
    });

    cardNode.detach();
    cardRef.destroy();
    this.listLayoutNode.activate();
  }
}
