import {
  animate,
  animation,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, startWith, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.token';
import { SystemInbox } from '@/app/core/system-inbox.enum';
import { MailRepository } from '@/app/data/mail.repository';
import { ContentComponent } from '@/app/shared/content/content.component';

import { MailListRefreshEvent } from '../core/mail-list-refresh.event';
import { MailsComponent } from '../mails.component';

let scrollTop = 0;

const mailCardsAnimation = animation([
  query(
    ':enter rpl-mail-card',
    [
      style({ opacity: 0 }),
      stagger(20, [
        animate(`225ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ opacity: 1 }),
      ]),
    ],
    { optional: true },
  ),
]);

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('content', [
      transition(':enter', [useAnimation(mailCardsAnimation)]),
      transition(':increment', [
        group([
          SharedAxisAnimation.apply('y', 'forward'),
          useAnimation(mailCardsAnimation),
        ]),
      ]),
      transition(':decrement', [
        group([
          SharedAxisAnimation.apply('y', 'backward'),
          useAnimation(mailCardsAnimation),
        ]),
      ]),
    ]),
  ],
  host: {
    ['[@content]']: 'navigationContext().latestMailboxIndex',
  },
})
export class MailListLayoutComponent implements OnInit, OnDestroy {
  AnimationCurves = AnimationCurves;
  breakpoints = inject(BREAKPOINTS);
  navigationContext = inject(NAVIGATION_CONTEXT);
  private route = inject(ActivatedRoute);
  private mailsComponent = inject(MailsComponent);
  private mailRepo = inject(MailRepository);
  private refresh$ = inject(MailListRefreshEvent);

  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));
  mailPrevId$ = this.route.queryParams.pipe(map((params) => params['prev']));
  mails$ = combineLatest([
    this.mailboxName$,
    this.refresh$.pipe(startWith(null)),
  ]).pipe(
    switchMap(([mailboxName]) =>
      this.mailRepo.query(
        mailboxName === SystemInbox.Starred
          ? (e) => e.isStarred
          : (e) => e.mailboxName === mailboxName,
      ),
    ),
    map((mails) =>
      mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
    ),
  );

  @ViewChild(ContentComponent) private content!: ContentComponent;

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    this.content.fakeScroll(scrollTop);
    await this.mailsComponent.animateLayout(250);
    this.content.setScrollTop(scrollTop);
  }

  ngOnDestroy(): void {
    scrollTop = this.content.getScrollTop();
  }
}
