import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { ActionStatus } from '../core/action-status';
import { EntityCollection } from '../core/entity-collection';

export interface MailboxState {
  mailboxes: EntityCollection<Mailbox>;
  mailboxesLoadingStatus: ActionStatus;
}
