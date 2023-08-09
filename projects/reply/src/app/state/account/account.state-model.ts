import { Account } from '@/app/entity/account/account.model';

import { ActionStatus } from '../core/action-status';
import { EntityCollection } from '../core/entity-collection';

export interface AccountState {
  currentId: string | null;
  accounts: EntityCollection<Account>;
  accountsLoadingStatus: ActionStatus;
}
