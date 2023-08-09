import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from '../core.actions';
import { CONTACT_ACTIONS } from './contact.actions';
import { ContactState } from './contact.state-model';

const contactInitialState: ContactState = {
  currentId: null,
  contacts: [],
  contactsLoadingStatus: { type: 'idle' },
};

export const contactStateReducer = createReducer(
  contactInitialState,
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.user.id,
    contacts: s.contacts.concat(p.result.user),
  })),

  on(CONTACT_ACTIONS.loadContacts, (s) => ({
    ...s,
    contactsLoadingStatus: { type: 'pending' } as const,
  })),
  on(CONTACT_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: p.result,
    contactsLoadingStatus: { type: 'completed' } as const,
  })),
  on(CONTACT_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
