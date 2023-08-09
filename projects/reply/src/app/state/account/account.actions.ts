import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from '@/app/entity/account/account.model';

import { generateActionGroupEvents } from '../core/action-generator';

export const ACCOUNT_ACTIONS = createActionGroup({
  source: 'account',
  events: {
    ...generateActionGroupEvents({
      name: 'loadAccounts' as const,
      params: emptyProps(),
      events: {
        completed: props<{ result: Account[] }>(),
        failed: props<{ error: Error }>(),
      },
    }),
  },
});
