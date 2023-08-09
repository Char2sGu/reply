import { createFeature, createSelector } from '@ngrx/store';

import { coreStateReducer } from './core.state-reducer';

export const CORE_STATE = createFeature({
  name: 'core',
  reducer: coreStateReducer,
  extraSelectors: (base) => ({
    selectAuthenticated: createSelector(
      base.selectAuthenticationStatus,
      (s) => s.type === 'completed',
    ),
  }),
});
