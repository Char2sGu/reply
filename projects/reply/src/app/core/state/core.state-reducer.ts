import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from './core.actions';
import { CoreState } from './core.state-model';
import { status } from './core/action-status';

const coreInitialState: CoreState = {
  breakpoints: {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  },

  authorization: null,
  authenticationStatus: status({ type: 'idle' }),
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
);
