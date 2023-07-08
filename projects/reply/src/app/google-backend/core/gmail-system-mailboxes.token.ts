import { InjectionToken } from '@angular/core';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { Mailbox } from '@/app/data/mailbox.model';

export const GMAIL_SYSTEM_MAILBOXES = new InjectionToken<Mailbox[]>(
  'GMAIL_SYSTEM_MAILBOXES',
  {
    providedIn: 'root',
    factory: () => [
      { id: 'INBOX', name: SystemMailboxName.Inbox },
      { id: 'TRASH', name: SystemMailboxName.Trash },
      { id: 'SPAM', name: SystemMailboxName.Spam },
    ],
  },
);
