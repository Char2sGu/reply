import { createReducer, on } from '@ngrx/store';

import { AUTHENTICATION_ACTIONS } from '../../core/authentication.actions';
import { CoreState } from './core.state-model';

const coreInitialState: CoreState = {
  authorization: null,
  authenticationStatus: { type: 'idle' } as const,
};

export const coreStateReducer = createReducer(
  coreInitialState,
  on(AUTHENTICATION_ACTIONS.authenticate, (s) => ({
    ...s,
    authenticationStatus: { type: 'pending' } as const,
  })),
  on(AUTHENTICATION_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    authorization: p.result.authorization,
    authenticationStatus: { type: 'completed' } as const,
  })),
  on(AUTHENTICATION_ACTIONS.authenticateCancelled, (s) => ({
    ...s,
    authenticationStatus: { type: 'idle' } as const,
  })),
  on(AUTHENTICATION_ACTIONS.authenticateFailed, (s, p) => ({
    ...s,
    authenticationStatus: { type: 'failed', error: p.error } as const,
  })),
  on(AUTHENTICATION_ACTIONS.authenticateExpired, (s) => ({
    ...s,
    authorization: null,
    authenticationStatus: { type: 'idle' } as const,
  })),
);
