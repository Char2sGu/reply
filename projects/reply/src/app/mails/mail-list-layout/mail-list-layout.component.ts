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
  Input,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { map, Observable, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { useBreakpoints } from '@/app/core/breakpoint.utils';
import {
  SystemMailboxName,
  VirtualMailboxName,
} from '@/app/core/mailbox-name.enums';
import { useSystemMailboxNameMapping } from '@/app/core/mailbox-name.utils';
import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.state';
import { useState } from '@/app/core/state';
import { Mail } from '@/app/data/mail/mail.model';
import { MailRepository } from '@/app/data/mail/mail.repository';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

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
  private mailRepo = inject(MailRepository);

  breakpoints = useBreakpoints();
  navigationContext = useState(NAVIGATION_CONTEXT);
  private systemMailboxes$ = useSystemMailboxNameMapping();

  // prettier-ignore
  @Input({ required: true }) set mailbox(v: Mailbox | VirtualMailboxName) { this.mailbox$.next(v) }
  mailbox$ = new ReplaySubject<Mailbox | VirtualMailboxName>(1);

  mailboxName$ = this.mailbox$.pipe(
    map((mailbox) => (typeof mailbox === 'string' ? mailbox : mailbox.name)),
  );

  mailboxAsEntity$ = this.mailbox$.pipe(
    map((mailbox) => (typeof mailbox === 'string' ? null : mailbox)),
  );

  mails$ = this.mailbox$.pipe(
    switchMap((mailbox) =>
      typeof mailbox === 'string'
        ? this.queryVirtualMailboxMails(mailbox)
        : this.queryRegularMailboxMails(mailbox),
    ),
    map((mails) =>
      mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
    ),
    shareReplay(1),
  );

  queryVirtualMailboxMails(mailbox: VirtualMailboxName): Observable<Mail[]> {
    if (mailbox === VirtualMailboxName.Starred)
      return this.systemMailboxes$.pipe(
        switchMap((systemMailboxes) =>
          this.mailRepo.query(
            (e) =>
              e.isStarred &&
              e.mailbox !== systemMailboxes[SystemMailboxName.Trash].id &&
              e.mailbox !== systemMailboxes[SystemMailboxName.Spam].id,
          ),
        ),
      );
    if (mailbox === VirtualMailboxName.Sent)
      return this.mailRepo.query((e) => e.type === 'sent');
    if (mailbox === VirtualMailboxName.Drafts)
      return this.mailRepo.query((e) => e.type === 'draft');
    throw new Error(`Invalid virtual mailbox: ${mailbox}`);
  }

  queryRegularMailboxMails(mailbox: Mailbox): Observable<Mail[]> {
    return this.mailRepo.query((e) => e.mailbox === mailbox.id);
  }
}
