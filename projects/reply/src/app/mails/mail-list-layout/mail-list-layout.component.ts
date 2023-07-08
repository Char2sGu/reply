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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { VirtualMailboxName } from '@/app/core/mailbox-name.enums';
import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.token';
import { Mail } from '@/app/data/mail.model';
import { MailRepository } from '@/app/data/mail.repository';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

const mailCardsAnimation = animation([
  query(
    ':enter rpl-mail-card',
    [
      style({ opacity: 0 }),
      stagger(25, [
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
export class MailListLayoutComponent {
  breakpoints = inject(BREAKPOINTS);
  navigationContext = inject(NAVIGATION_CONTEXT);
  private route = inject(ActivatedRoute);
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);

  mailboxName$ = this.route.params.pipe(
    map((params): string => params['mailboxName']),
  );

  mails$ = this.mailboxName$.pipe(
    switchMap((mailboxName) =>
      Object.values(VirtualMailboxName).includes(mailboxName as any)
        ? this.queryVirtualMailboxMails(mailboxName as VirtualMailboxName)
        : this.queryRegularMailboxMails(mailboxName),
    ),
    map((mails) =>
      mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
    ),
    shareReplay(1),
  );

  queryVirtualMailboxMails(
    mailboxName: VirtualMailboxName,
  ): Observable<Mail[]> {
    // TODO: implement data query for other virtual mailboxes
    return this.mailRepo.query(
      mailboxName === VirtualMailboxName.Starred
        ? (e) => e.isStarred
        : () => false,
    );
  }

  queryRegularMailboxMails(mailboxName: Mailbox['name']): Observable<Mail[]> {
    return this.mailboxRepo
      .query((e) => e.name === mailboxName)
      .pipe(
        switchMap(([mailbox]) =>
          this.mailRepo.query((e) => e.mailbox === mailbox.id),
        ),
      );
  }
}
