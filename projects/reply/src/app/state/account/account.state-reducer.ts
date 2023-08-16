import { createReducer, on } from '@ngrx/store';

import { AUTHENTICATION_ACTIONS } from '@/app/core/authentication.actions';
import { Account } from '@/app/entity/account/account.model';

import { ACCOUNT_ACTIONS } from '../../entity/account/account.actions';
import { EntityCollection } from '../shared/entity-collection';
import { AccountState } from './account.state-model';

const accountInitialState: AccountState = {
  currentId: null,
  accounts: new EntityCollection<Account>((e) => e.id),
  accountsLoadingStatus: { type: 'idle' },
};

export const accountStateReducer = createReducer(
  accountInitialState,
  on(AUTHENTICATION_ACTIONS.authenticateCompleted, (s, p) => ({
    ...s,
    currentId: p.result.account.id,
    accounts: s.accounts.upsert(p.result.account),
  })),
  on(AUTHENTICATION_ACTIONS.authenticateExpired, (s) => ({
    ...s,
    currentId: null,
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
