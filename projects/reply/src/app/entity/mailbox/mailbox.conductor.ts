import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { switchMapToAllRecorded } from '../core/reactive-repository.utils';
import { MailboxBackend } from './mailbox.backend';
import { Mailbox } from './mailbox.model';
import { MailboxRepository } from './mailbox.repository';

@Injectable({
  providedIn: 'root',
})
export class MailboxConductor {
  private backend = inject(MailboxBackend);
  private repo = inject(MailboxRepository);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.backend.loadMailboxes().pipe(switchMapToAllRecorded(this.repo));
  }
}
