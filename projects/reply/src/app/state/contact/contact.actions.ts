import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Contact } from '@/app/entity/contact/contact.model';

export const CONTACT_ACTIONS = createActionGroup({
  source: 'contact',
  events: {
    loadContacts: emptyProps(),
    loadContactsCompleted: props<{ result: Contact[] }>(),
    loadContactsFailed: props<{ error: Error }>(),
  },
});
