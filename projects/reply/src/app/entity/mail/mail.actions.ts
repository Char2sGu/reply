import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { generateActionGroupEvents } from '@/app/core/action-generator';

import { SyncResult } from '../core/synchronization';
import { Mailbox } from '../mailbox/mailbox.model';
import { Mail } from './mail.model';

export const MAIL_ACTIONS = createActionGroup({
  source: 'mail',
  events: {
    ...generateActionGroupEvents({
      name: 'loadMails' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: { mails: Mail[]; syncToken?: string } }>(),
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
    ...generateActionGroupEvents({
      name: 'syncMailChanges' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: SyncResult<Mail> }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
  },
});
