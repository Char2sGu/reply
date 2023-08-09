import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { generateActionGroupEvents } from '../core/action-generator';

export const MAIL_ACTIONS = createActionGroup({
  source: 'mail',
  events: {
    ...generateActionGroupEvents({
      name: 'loadMails' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: Mail[] }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
    ...generateActionGroupEvents({
      name: 'toggleMailStarredStatus' as const,
      params: props<{ mail: Mail }>(),
      events: {
        completed: props<{ result: Mail }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
    ...generateActionGroupEvents({
      name: 'toggleMailReadStatus' as const,
      params: props<{ mail: Mail; to?: 'read' | 'unread' }>(),
      events: {
        completed: props<{ result: Mail }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
    ...generateActionGroupEvents({
      name: 'moveMailToMailbox' as const,
      params: props<{ mail: Mail; mailbox: Mailbox | null }>(),
      events: {
        completed: props<{ result: Mail }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
    ...generateActionGroupEvents({
      name: 'deleteMail' as const,
      params: props<{ mail: Mail }>(),
      events: {
        completed: emptyProps(),
        failed: props<{ error: unknown }>(),
      },
    }),
  },
});
