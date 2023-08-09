import { Account } from '@/app/data/account/account.model';

import { ActionStatus } from '../core/action-status';

export interface AccountState {
  currentId: string | null;
  accounts: Account[];
  accountsLoadingStatus: ActionStatus;
}
