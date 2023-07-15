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
import {
  animationFrames,
  filter,
  first,
  firstValueFrom,
  map,
  of,
  pairwise,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

import { useActionFlow } from '../core/action-flow';
import { VirtualMailboxName } from '../core/mailbox-name.enums';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailboxRepository } from '../data/mailbox.repository';
import { ToggleMailReadStatusActionFlow } from './core/mail.action-flows';
import { MailCardAnimationPresenceComponent } from './core/mail-card-animation-presence/mail-card-animation-presence.component';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective],
})
export class MailsComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);
  private hostNode = inject(ProjectionNode);
  private layoutSnapper = inject(ProjectionNodeSnapper);
  private layoutAnimator = inject(LayoutAnimator);
  private viewContainer = inject(ViewContainerRef);

  private toggleMailReadStatus = useActionFlow(ToggleMailReadStatusActionFlow);

  mailId$ = this.route.params.pipe(map((p) => p['mailId']));
  mail$ = this.mailId$.pipe(
    switchMap((id) => (id ? this.mailRepo.retrieve(id) : of(null))),
    shareReplay(1),
  );

  mailboxName$ = this.route.params.pipe(map((p): string => p['mailboxName']));
  mailbox$ = this.mailboxName$.pipe(
    switchMap((mailboxName) =>
      Object.values(VirtualMailboxName).includes(mailboxName as any)
        ? of(mailboxName as VirtualMailboxName)
        : this.mailboxRepo
            .query((e) => e.name === mailboxName)
            .pipe(
              map(([e]) => e),
              filter(Boolean),
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
        filter(([prev, curr]) => !prev && !!curr),
        switchMap(() => this.initiateListToDetailLayoutAnimation()),
        switchMap(() =>
          this.mail$.pipe(
            first(),
            filter(Boolean),
            filter((m) => !m.isRead),
            switchMap((mail) =>
              this.toggleMailReadStatus({ mail, to: 'read' }),
            ),
          ),
        ),
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
