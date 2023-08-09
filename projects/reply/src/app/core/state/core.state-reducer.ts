import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from './core.actions';
import { CoreState, status } from './core.state-model';

const coreInitialState: CoreState = {
  breakpoints: {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  },

  authorization: null,
  user: null,
  account: null,
  authenticationStatus: status({ type: 'idle' }),

  accounts: [],
  accountsStatus: status({ type: 'idle' }),

  contacts: [],
  contactsStatus: status({ type: 'idle' }),

  mails: [],
  mailsStatus: status({ type: 'idle' }),

  mailboxes: [],
  mailboxesStatus: status({ type: 'idle' }),
};

export const coreStateReducer = createReducer(
  coreInitialState,

  on(CORE_ACTIONS.breakpointsUpdated, (s, p) => ({
    ...s,
    breakpoints: p.to,
  })),

  on(CORE_ACTIONS.authenticate, (s) => ({
    ...s,
    authenticating: true,
  })),
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    authorization: p.result.authorization,
    user: p.result.user,
    account: p.result.account,
    authenticating: false,
  })),
  on(CORE_ACTIONS.authenticateCancelled, (s) => ({
    ...s,
    authenticating: false,
  })),
  on(CORE_ACTIONS.authenticateFailed, (s, p) => ({
    ...s,
    authenticating: p.error,
  })),

  on(CORE_ACTIONS.loadAccounts, (s) => ({
    ...s,
    accountsStatus: status({ type: 'loading' }),
  })),
  on(CORE_ACTIONS.loadAccountsCompleted, (s, p) => ({
    ...s,
    accounts: p.result,
    accountsStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadAccountsFailed, (s, p) => ({
    ...s,
    accountsStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadContacts, (s) => ({
    ...s,
    contactsStatus: status({ type: 'loading' }),
  })),
  on(CORE_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: p.result,
    contactsStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadMails, (s) => ({
    ...s,
    mailsStatus: status({ type: 'loading' }),
  })),
  on(CORE_ACTIONS.loadMailsCompleted, (s, p) => ({
    ...s,
    mails: p.result,
    mailsStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadMailboxes, (s) => ({
    ...s,
    mailboxesStatus: status({ type: 'loading' }),
  })),
  on(CORE_ACTIONS.loadMailboxesCompleted, (s, p) => ({
    ...s,
    mailboxes: p.result,
    mailboxesStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadMailboxesFailed, (s, p) => ({
    ...s,
    mailboxesStatus: status({ type: 'failed', error: p.error }),
  })),
);
