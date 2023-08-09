import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { ActionStatus } from '../core/action-status';

export interface MailboxState {
  mailboxes: Mailbox[];
  mailboxesLoadingStatus: ActionStatus;
}
