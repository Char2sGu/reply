import { inject } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

import { Mailbox } from '../data/mailbox.model';
import { MailboxRepository } from '../data/mailbox.repository';
import { SystemMailboxName } from './mailbox-name.enums';

export interface SystemMailboxNameMapping
  extends Record<SystemMailboxName, Mailbox> {}

export function useSystemMailboxNameMapping(): Observable<SystemMailboxNameMapping> {
  const mailboxRepo = inject(MailboxRepository);
  const names: string[] = Object.values(SystemMailboxName);
  return mailboxRepo
    .query((e) => names.includes(e.name))
    .pipe(
      filter((results) => results.length === names.length),
      map((mailboxes) => {
        const mapping: Partial<SystemMailboxNameMapping> = {};
        for (const name of Object.values(SystemMailboxName)) {
          const mailbox = mailboxes.find((m) => m.name === name);
          if (!mailbox)
            throw new Error('Error resolving system mailbox from query result');
          mapping[name] = mailbox;
        }
        return mapping as Required<typeof mapping>;
      }),
    );
}
