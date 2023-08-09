import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  tap,
  withLatestFrom,
} from 'rxjs';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { MAIL_ACTIONS } from '@/app/state/mail/mail.actions';
import { MAILBOX_STATE } from '@/app/state/mailbox/mailbox.state-entry';

import { Mail } from '../../../entity/mail/mail.model';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent {
  private store = inject(Store);

  private trashMailbox$ = this.store
    .select(MAILBOX_STATE.selectSystemMailboxesIndexedByName)
    .pipe(map((mapping) => mapping[SystemMailboxName.Trash]));

  // prettier-ignore
  @Input('mail') set mailInput(v: Mail) { this.mail$.next(v) }
  mail$ = new BehaviorSubject<Mail | null>(null);

  click = new EventEmitter();

  actionType$ = combineLatest([
    this.trashMailbox$,
    this.mail$.pipe(filter(Boolean)),
  ]).pipe(
    map(([trashMailbox, mail]) => mail.mailbox === trashMailbox.id),
    map((inTrash) => (inTrash ? 'delete' : 'move-to-trash')),
  );

  constructor() {
    this.click
      .pipe(
        withLatestFrom(
          this.mail$.pipe(filter(Boolean)),
          this.trashMailbox$,
          this.actionType$,
        ),
        tap(([, mail, trashMailbox, actionType]) => {
          if (actionType === 'delete') {
            this.store.dispatch(MAIL_ACTIONS.deleteMail({ mail }));
          } else if (actionType === 'move-to-trash') {
            const actionCreator = MAIL_ACTIONS.moveMailToMailbox;
            const a = actionCreator({ mail, mailbox: trashMailbox });
            this.store.dispatch(a);
          } else {
            throw new Error(`Unknown action: ${actionType}`);
          }
        }),
      )
      .subscribe();
  }
}
