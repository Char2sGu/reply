import { createFeature, createSelector } from '@ngrx/store';

import { accountStateReducer } from './account.state-reducer';

export const ACCOUNT_STATE = createFeature({
  name: 'account',
  reducer: accountStateReducer,
  extraSelectors: (base) => ({
    selectCurrent: createSelector(
      base.selectCurrentId,
      base.selectAccounts,
      (currentId, accounts) => {
        if (!currentId) return null;
        return accounts.retrieve(currentId);
      },
    ),
  }),
});
