import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { generateActionGroupEvents } from '../core/action-generator';

export const MAILBOX_ACTIONS = createActionGroup({
  source: 'mailbox',
  events: {
    ...generateActionGroupEvents({
      name: 'loadMailboxes' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: Mailbox[] }>(),
        failed: props<{ error: Error }>(),
      },
    }),
  },
});
