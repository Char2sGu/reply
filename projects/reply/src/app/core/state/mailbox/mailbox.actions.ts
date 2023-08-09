import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Mailbox } from '@/app/data/mailbox/mailbox.model';

export const MAILBOX_ACTIONS = createActionGroup({
  source: 'mailbox',
  events: {
    loadMailboxes: emptyProps(),
    loadMailboxesCompleted: props<{ result: Mailbox[] }>(),
    loadMailboxesFailed: props<{ error: Error }>(),
  },
});
