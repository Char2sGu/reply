import { inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';

import { MailboxConductor } from '../data/mailbox/mailbox.conductor';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { MailboxRepository } from '../data/mailbox/mailbox.repository';
import { DEMO_MAILBOXES } from './core/mailbox/demo-mailboxes.object';

export class DemoMailboxService implements MailboxConductor {
  private mailboxes = inject(DEMO_MAILBOXES);
  private mailboxRepo = inject(MailboxRepository);

  loadMailboxes(): Observable<Mailbox[]> {
    return combineLatest(this.mailboxes.map((m) => this.mailboxRepo.record(m)));
  }
}
