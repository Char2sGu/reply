import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs';

import { PopupService } from '@/app/core/popup/popup.service';
import { MAIL_ACTIONS } from '@/app/entity/mail/mail.actions';
import { MAILBOX_STATE } from '@/app/state/mailbox/mailbox.state-entry';

import { MailboxSelectionPopupComponent } from './mailbox-selection-popup/mailbox-selection-popup.component';
import { MAILS_ACTIONS } from './mails.actions';

@Injectable()
export class MailsEffects {
  private actions = inject(Actions);
  private store = inject(Store);
  private popupService = inject(PopupService);

  openMoveMailDialog = createEffect(() =>
    this.actions.pipe(
      ofType(MAILS_ACTIONS.openMoveMailDialog),
      withLatestFrom(this.store.select(MAILBOX_STATE.selectMailboxes)),
      concatMap(([{ mail }, mailboxes]) => {
        const current = mail.mailbox
          ? mailboxes.retrieve(mail.mailbox)
          : undefined;
        const popupRef = this.popupService.popupDialog(
          MailboxSelectionPopupComponent,
          { title: 'Move to', current },
        );
        return popupRef.event$.pipe(
          map((e) => (e.type === 'output' ? e.payload : null)),
          filter(Boolean),
          map((mailbox) => MAIL_ACTIONS.moveMailToMailbox({ mail, mailbox })),
        );
      }),
    ),
  );
}
