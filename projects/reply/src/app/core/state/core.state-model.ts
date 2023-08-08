import { Mail } from '@/app/data/mail/mail.model';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { Account } from '../../data/account/account.model';
import { Contact } from '../../data/contact/contact.model';
import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  authenticating: boolean | Error;

  user: Contact | null;
  userLoading: boolean | Error;

  account: Account | null;
  accountLoading: boolean | Error;

  accounts: Account[];
  accountsLoading: boolean | Error;

  contacts: Contact[];
  contactsLoading: boolean | Error;

  mails: Mail[];
  mailsLoading: boolean | Error;

  mailboxes: Mailbox[];
  mailboxesLoading: boolean | Error;
}
