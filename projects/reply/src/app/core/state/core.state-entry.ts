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
    selectUser: createSelector(
      base.selectUserId,
      base.selectContacts,
      (id, contacts) => {
        if (!id) return null;
        const result = contacts.find((c) => c.id === id);
        if (!result) throw new Error(`Missing user ${id}`);
        return result;
      },
    ),
    selectAccount: createSelector(
      base.selectAccountId,
      base.selectAccounts,
      (id, accounts) => {
        if (!id) return null;
        const result = accounts.find((c) => c.id === id);
        if (!result) throw new Error(`Missing account ${id}`);
        return result;
      },
    ),
  }),
});
