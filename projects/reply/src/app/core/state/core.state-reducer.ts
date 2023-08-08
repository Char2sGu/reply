import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from './core.actions';
import { CoreState } from './core.state-model';

const coreInitialState: CoreState = {
  breakpoints: {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  },

  authorization: null,
  authenticating: false,

  user: null,
  userLoading: false,

  account: null,
  accountLoading: false,

  accounts: [],
  accountsLoading: false,

  contacts: [],
  contactsLoading: false,

  mails: [],
  mailsLoading: false,

  mailboxes: [],
  mailboxesLoading: false,
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
    authorization: p.result,
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

  on(CORE_ACTIONS.loadUser, (s) => ({
    ...s,
    userLoading: true,
  })),
  on(CORE_ACTIONS.loadUserCompleted, (s, p) => ({
    ...s,
    user: p.result,
    userLoading: false,
  })),
  on(CORE_ACTIONS.loadUserFailed, (s, p) => ({
    ...s,
    userLoading: p.error,
  })),

  on(CORE_ACTIONS.loadAccount, (s) => ({
    ...s,
    accountLoading: true,
  })),
  on(CORE_ACTIONS.loadAccountCompleted, (s, p) => ({
    ...s,
    account: p.result,
    accountLoading: false,
  })),
  on(CORE_ACTIONS.loadAccountFailed, (s, p) => ({
    ...s,
    accountLoading: p.error,
  })),

  on(CORE_ACTIONS.loadAccounts, (s) => ({
    ...s,
    accountsLoading: true,
  })),
  on(CORE_ACTIONS.loadAccountsCompleted, (s, p) => ({
    ...s,
    accounts: p.result,
    accountsLoading: false,
  })),
  on(CORE_ACTIONS.loadAccountsFailed, (s, p) => ({
    ...s,
    accountsLoading: p.error,
  })),

  on(CORE_ACTIONS.loadContacts, (s) => ({
    ...s,
    contactsLoading: true,
  })),
  on(CORE_ACTIONS.loadContactsCompleted, (s, p) => ({
    ...s,
    contacts: p.result,
    contactsLoading: false,
  })),
  on(CORE_ACTIONS.loadContactsFailed, (s, p) => ({
    ...s,
    contactsLoading: p.error,
  })),

  on(CORE_ACTIONS.loadMails, (s) => ({
    ...s,
    mailsLoading: true,
  })),
  on(CORE_ACTIONS.loadMailsCompleted, (s, p) => ({
    ...s,
    mails: p.result,
    mailsLoading: false,
  })),
  on(CORE_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsLoading: p.error,
  })),

  on(CORE_ACTIONS.loadMailboxes, (s) => ({
    ...s,
    mailboxesLoading: true,
  })),
  on(CORE_ACTIONS.loadMailboxesCompleted, (s, p) => ({
    ...s,
    mailboxes: p.result,
    mailboxesLoading: false,
  })),
  on(CORE_ACTIONS.loadMailboxesFailed, (s, p) => ({
    ...s,
    mailboxesLoading: p.error,
  })),
);
