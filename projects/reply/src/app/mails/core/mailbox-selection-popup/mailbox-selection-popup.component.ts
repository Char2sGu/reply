import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { PopupComponent } from '@/app/core/popup/popup.core';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';
import { MAILBOX_STATE } from '@/app/state/mailbox/mailbox.state-entry';

@Component({
  selector: 'rpl-mailbox-selection-popup',
  templateUrl: './mailbox-selection-popup.component.html',
  styleUrls: ['./mailbox-selection-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailboxSelectionPopupComponent extends PopupComponent<
  { title?: string; current?: Mailbox },
  Mailbox
> {
  private store = inject(Store);

  mailboxes$ = this.store.select(MAILBOX_STATE.selectMailboxes).pipe(
    map((collection) => {
      const current = this.popupRef.input.current;
      if (!current) return collection.all();
      return collection.query((e) => e.id !== current.id);
    }),
  );
}
