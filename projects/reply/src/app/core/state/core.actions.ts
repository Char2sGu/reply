import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from '@/app/data/account/account.model';
import { Contact } from '@/app/data/contact/contact.model';
import { Mail } from '@/app/data/mail/mail.model';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';

export const CORE_ACTIONS = createActionGroup({
  source: 'core',
  events: {
    breakpointsUpdated: props<{ to: BreakpointMap }>(),

    authenticate: (p: { hint?: string } = {}) => p,
    authenticateCompleted: props<{
      result: { authorization: Authorization; user: Contact; account: Account };
    }>(),
    authenticateCancelled: emptyProps(),
    authenticateFailed: props<{ error: Error }>(),

    loadAccounts: emptyProps(),
    loadAccountsCompleted: props<{ result: Account[] }>(),
    loadAccountsFailed: props<{ error: Error }>(),

    loadContacts: emptyProps(),
    loadContactsCompleted: props<{ result: Contact[] }>(),
    loadContactsFailed: props<{ error: Error }>(),

    loadMails: emptyProps(),
    loadMailsCompleted: props<{ result: Mail[] }>(),
    loadMailsFailed: props<{ error: Error }>(),

    loadMailboxes: emptyProps(),
    loadMailboxesCompleted: props<{ result: Mailbox[] }>(),
    loadMailboxesFailed: props<{ error: Error }>(),
  },
});
