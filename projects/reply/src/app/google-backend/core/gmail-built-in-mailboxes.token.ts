import { InjectionToken } from '@angular/core';

import { BuiltInMailboxName, Mailbox } from '@/app/data/mailbox.model';

export const GMAIL_BUILT_IN_MAILBOXES = new InjectionToken<Mailbox[]>(
  'GMAIL_SYSTEM_MAILBOXES',
  {
    providedIn: 'root',
    factory: () => [
      { id: 'INBOX', name: BuiltInMailboxName.Inbox, type: 'system' },
      { id: 'STARRED', name: BuiltInMailboxName.Starred, type: 'virtual' },
      { id: 'SENT', name: BuiltInMailboxName.Sent, type: 'virtual' },
      { id: 'TRASH', name: BuiltInMailboxName.Trash, type: 'system' },
      { id: 'SPAM', name: BuiltInMailboxName.Spam, type: 'system' },
      { id: 'DRAFT', name: BuiltInMailboxName.Drafts, type: 'system' },
    ],
  },
);
