import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Contact } from '@/app/entity/contact/contact.model';

import { generateActionGroupEvents } from '../../core/action-generator';
import { SyncResult } from '../core/synchronization';

export const CONTACT_ACTIONS = createActionGroup({
  source: 'contact',
  events: {
    ...generateActionGroupEvents({
      name: 'loadContacts' as const,
      params: emptyProps(),
      events: {
        completed: props<{
          result: { results: Contact[]; syncToken: string };
        }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
    ...generateActionGroupEvents({
      name: 'syncContactChanges' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: SyncResult<Contact> }>(),
        failed: props<{ error: unknown }>(),
      },
    }),
  },
});
