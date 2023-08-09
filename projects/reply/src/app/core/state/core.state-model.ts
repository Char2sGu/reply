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
  authenticationStatus: Status;

  accounts: Account[];
  accountsStatus: Status;

  contacts: Contact[];
  contactsStatus: Status;

  mails: Mail[];
  mailsStatus: Status;

  mailboxes: Mailbox[];
  mailboxesStatus: Status;
}

export const status = (s: Status): Status => s;

export type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'completed' }
  | { type: 'failed'; error: unknown };
