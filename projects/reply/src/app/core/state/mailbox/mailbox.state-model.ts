import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { ActionStatus } from '../core/action-status';

export interface MailboxState {
  mailboxes: Mailbox[];
  mailboxesLoadingStatus: ActionStatus;
}
