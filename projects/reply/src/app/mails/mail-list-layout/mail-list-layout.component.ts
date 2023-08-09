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
import { toSignal } from '@angular/core/rxjs-interop';
import { AnimationCurves } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { map, Observable, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import {
  SystemMailboxName,
  VirtualMailboxName,
} from '@/app/core/mailbox-name.enums';
import { useSystemMailboxNameMapping } from '@/app/core/mailbox-name.utils';
import { NavigationService } from '@/app/core/navigation.service';
import { CORE_STATE } from '@/app/core/state/core.state-entry';
import { Mail } from '@/app/entity/mail/mail.model';
import { MailRepository } from '@/app/entity/mail/mail.repository';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

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
    ['[@host-mailboxChange]']: 'activeNavItemIndex()',
  },
})
export class MailListLayoutComponent {
  private store = inject(Store);
  private mailRepo = inject(MailRepository);
  private navService = inject(NavigationService);
  private systemMailboxes$ = useSystemMailboxNameMapping();

  breakpoints = this.store.selectSignal(CORE_STATE.selectBreakpoints);

  activeNavItemIndex = toSignal(
    this.navService.activeItemIndex$, //
    { requireSync: true },
  );

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
