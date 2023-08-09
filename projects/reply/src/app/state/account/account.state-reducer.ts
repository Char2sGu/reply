import { createReducer, on } from '@ngrx/store';

import { Account } from '@/app/entity/account/account.model';

import { CORE_ACTIONS } from '../core.actions';
import { EntityCollection } from '../core/entity-collection';
import { ACCOUNT_ACTIONS } from './account.actions';
import { AccountState } from './account.state-model';

const accountInitialState: AccountState = {
  currentId: null,
  accounts: new EntityCollection<Account>((e) => e.id),
  accountsLoadingStatus: { type: 'idle' },
};

export const accountStateReducer = createReducer(
  accountInitialState,
  on(CORE_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.account.id,
    accounts: s.accounts.upsert(p.result.account),
  })),
  on(ACCOUNT_ACTIONS.loadAccounts, (s) => ({
    ...s,
    accountsLoadingStatus: { type: 'pending' } as const,
  })),
  on(ACCOUNT_ACTIONS.loadAccountsCompleted, (s, p) => ({
    ...s,
    accounts: s.accounts.upsert(...p.result),
    accountsLoadingStatus: { type: 'completed' } as const,
  })),
  on(ACCOUNT_ACTIONS.loadAccountsFailed, (s, p) => ({
    ...s,
    accountsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
