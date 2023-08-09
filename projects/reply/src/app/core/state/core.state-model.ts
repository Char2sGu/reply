import { Mail } from '@/app/data/mail/mail.model';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { Account } from '../../data/account/account.model';
import { Contact } from '../../data/contact/contact.model';
import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';
import { ActionStatus } from './core/action-status';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  userId: Contact['id'] | null;
  accountId: Account['id'] | null;
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
