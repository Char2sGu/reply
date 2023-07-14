import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PopupComponent } from '@/app/core/popup/popup.service';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

@Component({
  selector: 'rpl-mailbox-selection-popup',
  templateUrl: './mailbox-selection-popup.component.html',
  styleUrls: ['./mailbox-selection-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailboxSelectionPopupComponent extends PopupComponent<
  void,
  Mailbox
> {
  private mailboxRepo = inject(MailboxRepository);
  mailboxes$ = this.mailboxRepo.query();
}
