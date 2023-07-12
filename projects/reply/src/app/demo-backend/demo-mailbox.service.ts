import { inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';

import { Mailbox } from '../data/mailbox.model';
import { MailboxRepository } from '../data/mailbox.repository';
import { MailboxService } from '../data/mailbox.service';
import { DEMO_MAILBOXES } from './core/demo-mailboxes.token';

export class DemoMailboxService implements MailboxService {
  private mailboxes = inject(DEMO_MAILBOXES);
  private mailboxRepo = inject(MailboxRepository);

  loadMailboxes(): Observable<Mailbox[]> {
    return combineLatest(
      this.mailboxes.map((m) => this.mailboxRepo.insertOrPatch(m)),
    );
  }
}
