import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MailboxBackend } from '../data/mailbox/mailbox.backend';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { DEMO_MAILBOXES } from './core/mailbox/demo-mailboxes.object';

export class DemoMailboxBackend implements MailboxBackend {
  private mailboxes = inject(DEMO_MAILBOXES);

  loadMailboxes(): Observable<Mailbox[]> {
    return of(this.mailboxes);
  }
}
