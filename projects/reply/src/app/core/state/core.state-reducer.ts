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
  accountsLoadingStatus: status({ type: 'idle' }),

  contacts: [],
  contactsLoadingStatus: status({ type: 'idle' }),

  mails: [],
  mailsLoadingStatus: status({ type: 'idle' }),

  mailboxes: [],
  mailboxesLoadingStatus: status({ type: 'idle' }),
};

export const coreStateReducer = createReducer(
  coreInitialState,

  on(CORE_ACTIONS.breakpointsUpdated, (s, p) => ({
    ...s,
    breakpoints: p.to,
  })),

  on(CORE_ACTIONS.authenticate, (s) => ({
    ...s,
    authenticationStatus: status({ type: 'pending' }),
  })),
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    authorization: p.result.authorization,
    user: p.result.user,
    account: p.result.account,
    authenticationStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.authenticateCancelled, (s) => ({
    ...s,
    authenticationStatus: status({ type: 'idle' }),
  })),
  on(CORE_ACTIONS.authenticateFailed, (s, p) => ({
    ...s,
    authenticationStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadAccounts, (s) => ({
    ...s,
    accountsLoadingStatus: status({ type: 'pending' }),
  })),
  on(CORE_ACTIONS.loadAccountsCompleted, (s, p) => ({
    ...s,
    accounts: p.result,
    accountsLoadingStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadAccountsFailed, (s, p) => ({
    ...s,
    accountsLoadingStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadContacts, (s) => ({
    ...s,
    contactsLoadingStatus: status({ type: 'pending' }),
  })),
  on(CORE_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: p.result,
    contactsLoadingStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsLoadingStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadMails, (s) => ({
    ...s,
    mailsLoadingStatus: status({ type: 'pending' }),
  })),
  on(CORE_ACTIONS.loadMailsCompleted, (s, p) => ({
    ...s,
    mails: p.result,
    mailsLoadingStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsLoadingStatus: status({ type: 'failed', error: p.error }),
  })),

  on(CORE_ACTIONS.loadMailboxes, (s) => ({
    ...s,
    mailboxesLoadingStatus: status({ type: 'pending' }),
  })),
  on(CORE_ACTIONS.loadMailboxesCompleted, (s, p) => ({
    ...s,
    mailboxes: p.result,
    mailboxesLoadingStatus: status({ type: 'completed' }),
  })),
  on(CORE_ACTIONS.loadMailboxesFailed, (s, p) => ({
    ...s,
    mailboxesLoadingStatus: status({ type: 'failed', error: p.error }),
  })),
);
