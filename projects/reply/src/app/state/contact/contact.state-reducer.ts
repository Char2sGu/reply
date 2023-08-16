import { createReducer, on } from '@ngrx/store';

import { AUTHENTICATION_ACTIONS } from '@/app/core/authentication.actions';
import { Contact } from '@/app/entity/contact/contact.model';

import { CONTACT_ACTIONS } from '../../entity/contact/contact.actions';
import { EntityCollection } from '../shared/entity-collection';
import { ContactState } from './contact.state-model';

const contactInitialState: ContactState = {
  currentId: null,
  contacts: new EntityCollection<Contact>((e) => e.id),
  contactsLoadingStatus: { type: 'idle' },
};

export const contactStateReducer = createReducer(
  contactInitialState,
  on(AUTHENTICATION_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.user.id,
    contacts: s.contacts.upsert(p.result.user),
  })),
  on(AUTHENTICATION_ACTIONS.authenticateExpired, (s) => ({
    ...s,
    currentId: null,
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
