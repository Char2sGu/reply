import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from '@/app/data/account/account.model';

export const ACCOUNT_ACTIONS = createActionGroup({
  source: 'account',
  events: {
    loadAccounts: emptyProps(),
    loadAccountsCompleted: props<{ result: Account[] }>(),
    loadAccountsFailed: props<{ error: Error }>(),
  },
});
