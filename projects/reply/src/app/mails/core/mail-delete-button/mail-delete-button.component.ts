import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, first, map, switchMap } from 'rxjs';

import { useActionFlow } from '@/app/core/action-flow';
import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { MAIL_ACTIONS } from '@/app/state/mail/mail.actions';
import { MAILBOX_STATE } from '@/app/state/mailbox/mailbox.state-entry';

import { Mail } from '../../../entity/mail/mail.model';
import { MoveMailToMailboxActionFlow } from '../mail.action-flows';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent {
  private store = inject(Store);
  private moveMail = useActionFlow(MoveMailToMailboxActionFlow);

  private trashMailbox$ = this.store
    .select(MAILBOX_STATE.selectSystemMailboxesIndexedByName)
    .pipe(map((mapping) => mapping[SystemMailboxName.Trash]));

  @Input() mail!: Mail;

  click = new EventEmitter();

  action$ = this.trashMailbox$.pipe(
    map((trashMailbox) => this.mail.mailbox === trashMailbox.id),
    map((inTrash) => (inTrash ? 'delete' : 'move-to-trash')),
  );

  constructor() {
    this.click
      .pipe(
        switchMap(() => this.action$),
        switchMap((action) => {
          if (action === 'delete') {
            this.store.dispatch(MAIL_ACTIONS.deleteMail({ mail: this.mail }));
            return EMPTY;
          }
          return this.trashMailbox$.pipe(
            first(),
            switchMap((mailbox) => this.moveMail({ mail: this.mail, mailbox })),
          );
        }),
      )
      .subscribe();
  }
}
