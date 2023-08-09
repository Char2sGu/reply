import { createReducer, on } from '@ngrx/store';

import { Contact } from '@/app/entity/contact/contact.model';

import { CORE_ACTIONS } from '../core.actions';
import { EntityCollection } from '../core/entity-collection';
import { CONTACT_ACTIONS } from './contact.actions';
import { ContactState } from './contact.state-model';

const contactInitialState: ContactState = {
  currentId: null,
  contacts: new EntityCollection<Contact>((e) => e.id),
  contactsLoadingStatus: { type: 'idle' },
};

export const contactStateReducer = createReducer(
  contactInitialState,
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.user.id,
    contacts: s.contacts.upsert(p.result.user),
  })),

  on(CONTACT_ACTIONS.loadContacts, (s) => ({
    ...s,
    contactsLoadingStatus: { type: 'pending' } as const,
  })),
  on(CONTACT_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: s.contacts.upsert(...p.result),
    contactsLoadingStatus: { type: 'completed' } as const,
  })),
  on(CONTACT_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
