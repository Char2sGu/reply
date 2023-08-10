import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Mailbox } from '@/app/entity/mailbox/mailbox.model';
import { MailboxService } from '@/app/entity/mailbox/mailbox.service';

import { DEMO_MAILBOXES } from './demo-mailboxes.object';

export class DemoMailboxService implements MailboxService {
  private mailboxes = inject(DEMO_MAILBOXES);

  loadMailboxes(): Observable<Mailbox[]> {
    return of(this.mailboxes);
  }
}
