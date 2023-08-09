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
  authenticationStatus: { type: 'idle' } as const,
};

export const coreStateReducer = createReducer(
  coreInitialState,

  on(CORE_ACTIONS.breakpointsUpdated, (s, p) => ({
    ...s,
    breakpoints: p.to,
  })),

  on(CORE_ACTIONS.authenticate, (s) => ({
    ...s,
    authenticationStatus: { type: 'pending' } as const,
  })),
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    authorization: p.result.authorization,
    authenticationStatus: { type: 'completed' } as const,
  })),
  on(CORE_ACTIONS.authenticateCancelled, (s) => ({
    ...s,
    authenticationStatus: { type: 'idle' } as const,
  })),
  on(CORE_ACTIONS.authenticateFailed, (s, p) => ({
    ...s,
    authenticationStatus: { type: 'failed', error: p.error } as const,
  })),
);
