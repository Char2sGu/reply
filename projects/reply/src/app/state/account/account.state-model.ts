import { Account } from '@/app/entity/account/account.model';

import { ActionStatus } from '../core/action-status';

export interface AccountState {
  currentId: string | null;
  accounts: Account[];
  accountsLoadingStatus: ActionStatus;
}
