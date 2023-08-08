import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from './core.actions';
import { CoreState } from './core.state-model';

const coreInitialState: CoreState = {
  authorization: null,
  authenticating: false,
  user: null,
  userLoading: false,
  account: null,
  accountLoading: false,
};

export const coreStateReducer = createReducer(
  coreInitialState,
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
);
