import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

export const MAIL_ACTIONS = createActionGroup({
  source: 'mail',
  events: {
    loadMails: emptyProps(),
    loadMailsCompleted: props<{ result: Mail[] }>(),
    loadMailsFailed: props<{ error: Error }>(),

    toggleMailStarredStatus: props<{ mail: Mail }>(),
    toggleMailStarredStatusCompleted: props<{ mail: Mail; result: Mail }>(),
    toggleMailStarredStatusFailed: props<{ mail: Mail; error: Error }>(),

    toggleMailReadStatus: props<{ mail: Mail; to: 'read' | 'unread' }>(),
    toggleMailReadStatusCompleted: props<{ mail: Mail; result: Mail }>(),
    toggleMailReadStatusFailed: props<{ mail: Mail; error: Error }>(),

    moveMailToMailbox: props<{ mail: Mail; mailbox: Mailbox }>(),
    moveMailToMailboxCompleted: props<{ mail: Mail; result: Mail }>(),
    moveMailToMailboxFailed: props<{ mail: Mail; error: Error }>(),

    deleteMail: props<{ mail: Mail }>(),
    deleteMailCompleted: props<{ mail: Mail }>(),
    deleteMailFailed: props<{ mail: Mail; error: Error }>(),
  },
});
