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
  catchError,
  filter,
  first,
  firstValueFrom,
  map,
  Observable,
  of,
  pairwise,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

import { NotificationService } from '../core/notification.service';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
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
  private mailService = inject(MailService);
  private notifier = inject(NotificationService);
  private hostNode = inject(ProjectionNode);
  private layoutSnapper = inject(ProjectionNodeSnapper);
  private layoutAnimator = inject(LayoutAnimator);
  private viewContainer = inject(ViewContainerRef);

  mailId$ = this.route.params.pipe(map((params) => params['mailId']));
  mail$ = this.mailId$.pipe(
    switchMap((id) => (id ? this.mailRepo.retrieve(id) : of(null))),
    shareReplay(1),
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
            switchMap((mail) => this.markAsRead(mail)),
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

  markAsRead(mail: Mail): Observable<void> {
    return this.mailService.markMailAsRead(mail).pipe(
      catchError((err, caught) =>
        this.notifier
          .notify('Failed to mark mail as read', 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            switchMap(() => caught),
          ),
      ),
    );
  }
}
