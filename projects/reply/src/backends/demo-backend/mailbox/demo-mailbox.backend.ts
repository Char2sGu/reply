import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MailboxBackend } from '@/app/entity/mailbox/mailbox.backend';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { DEMO_MAILBOXES } from './demo-mailboxes.object';

export class DemoMailboxBackend implements MailboxBackend {
  private mailboxes = inject(DEMO_MAILBOXES);

  loadMailboxes(): Observable<Mailbox[]> {
    return of(this.mailboxes);
  }
}
