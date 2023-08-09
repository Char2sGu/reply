import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from '../core.actions';
import { status } from '../core/action-status';
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
    contactsLoadingStatus: status({ type: 'pending' }),
  })),
  on(CONTACT_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: p.result,
    contactsLoadingStatus: status({ type: 'completed' }),
  })),
  on(CONTACT_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsLoadingStatus: status({ type: 'failed', error: p.error }),
  })),
);
