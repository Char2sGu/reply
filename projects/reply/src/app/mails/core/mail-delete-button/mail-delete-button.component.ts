import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
} from '@angular/core';
import { first, map, switchMap } from 'rxjs';

import { useActionFlow } from '@/app/core/action-flow';
import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { useSystemMailboxNameMapping } from '@/app/core/mailbox-name.utils';

import { Mail } from '../../../entity/mail/mail.model';
import {
  DeleteMailActionFlow,
  MoveMailToMailboxActionFlow,
} from '../mail.action-flows';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent {
  private deleteMail = useActionFlow(DeleteMailActionFlow);
  private moveMail = useActionFlow(MoveMailToMailboxActionFlow);

  private systemMailboxes$ = useSystemMailboxNameMapping();
  private trashMailbox$ = this.systemMailboxes$.pipe(
    map((mapping) => mapping[SystemMailboxName.Trash]),
  );

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
          if (action === 'delete') return this.deleteMail({ mail: this.mail });
          return this.trashMailbox$.pipe(
            first(),
            switchMap((mailbox) => this.moveMail({ mail: this.mail, mailbox })),
          );
        }),
      )
      .subscribe();
  }
}
