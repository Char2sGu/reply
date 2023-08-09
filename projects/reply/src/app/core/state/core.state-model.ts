import { Mail } from '@/app/data/mail/mail.model';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { Account } from '../../data/account/account.model';
import { Contact } from '../../data/contact/contact.model';
import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  user: Contact | null;
  account: Account | null;
  authenticationStatus: ActionStatus;

  accounts: Account[];
  accountsLoadingStatus: ActionStatus;

  contacts: Contact[];
  contactsLoadingStatus: ActionStatus;

  mails: Mail[];
  mailsLoadingStatus: ActionStatus;

  mailboxes: Mailbox[];
  mailboxesLoadingStatus: ActionStatus;
}

export const status = (s: ActionStatus): ActionStatus => s;

export type ActionStatus =
  | { type: 'idle' }
  | { type: 'pending' }
  | { type: 'completed' }
  | { type: 'failed'; error: unknown };
