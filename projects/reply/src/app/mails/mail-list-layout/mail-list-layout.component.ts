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
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import {
  SystemMailboxName,
  VirtualMailboxName,
} from '@/app/core/mailbox-name.enums';
import { useSystemMailboxNameMapping } from '@/app/core/mailbox-name.utils';
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
      style({ transform: 'scale(92%)' }),
      stagger(25, [
        animate(`225ms ${AnimationCurves.DECELERATION_CURVE}`),
        style({ opacity: 1, transform: 'scale(1)' }),
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
    trigger('host-entrance', [
      transition(':enter', [useAnimation(mailCardsAnimation)]),
    ]),
    trigger('host-mailboxChange', [
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
    ['[@host-entrance]']: '',
    ['[@host-mailboxChange]']: 'navigationContext().latestMailboxIndex',
  },
})
export class MailListLayoutComponent {
  console = console;
  breakpoints = inject(BREAKPOINTS);
  navigationContext = inject(NAVIGATION_CONTEXT);
  private route = inject(ActivatedRoute);
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);

  private systemMailboxes$ = useSystemMailboxNameMapping();

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
    return mailboxName === VirtualMailboxName.Starred
      ? this.systemMailboxes$.pipe(
          switchMap((systemMailboxes) =>
            this.mailRepo.query(
              (e) =>
                e.isStarred &&
                e.mailbox !== systemMailboxes[SystemMailboxName.Trash].id &&
                e.mailbox !== systemMailboxes[SystemMailboxName.Spam].id,
            ),
          ),
        )
      : of([]);
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
