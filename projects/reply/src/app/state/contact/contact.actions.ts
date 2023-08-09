import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Contact } from '@/app/entity/contact/contact.model';

import { generateActionGroupEvents } from '../core/action-generator';

export const CONTACT_ACTIONS = createActionGroup({
  source: 'contact',
  events: {
    ...generateActionGroupEvents({
      name: 'loadContacts' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: Contact[] }>(),
        failed: props<{ error: Error }>(),
      },
    }),
  },
});
