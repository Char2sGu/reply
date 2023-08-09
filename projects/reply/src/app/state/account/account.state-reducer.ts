import { createReducer, on } from '@ngrx/store';

import { CORE_ACTIONS } from '../core.actions';
import { ACCOUNT_ACTIONS } from './account.actions';
import { AccountState } from './account.state-model';

const accountInitialState: AccountState = {
  currentId: null,
  accounts: [],
  accountsLoadingStatus: { type: 'idle' },
};

export const accountStateReducer = createReducer(
  accountInitialState,
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.account.id,
    accounts: s.accounts.concat(p.result.account),
  })),
  on(ACCOUNT_ACTIONS.loadAccounts, (s) => ({
    ...s,
    accountsLoadingStatus: { type: 'pending' } as const,
  })),
  on(ACCOUNT_ACTIONS.loadAccountsCompleted, (s, p) => ({
    ...s,
    accounts: p.result,
    accountsLoadingStatus: { type: 'completed' } as const,
  })),
  on(ACCOUNT_ACTIONS.loadAccountsFailed, (s, p) => ({
    ...s,
    accountsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
