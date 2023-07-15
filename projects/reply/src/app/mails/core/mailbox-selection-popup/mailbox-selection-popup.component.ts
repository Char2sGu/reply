import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PopupComponent } from '@/app/core/popup/popup.core';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

@Component({
  selector: 'rpl-mailbox-selection-popup',
  templateUrl: './mailbox-selection-popup.component.html',
  styleUrls: ['./mailbox-selection-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailboxSelectionPopupComponent extends PopupComponent<
  { current?: Mailbox },
  Mailbox
> {
  private mailboxRepo = inject(MailboxRepository);
  mailboxes$ = this.queryMailboxes();

  private queryMailboxes(): Observable<Mailbox[]> {
    const current = this.popupRef.input.current;
    return current
      ? this.mailboxRepo.query((e) => e.id !== current.id)
      : this.mailboxRepo.query();
  }
}
