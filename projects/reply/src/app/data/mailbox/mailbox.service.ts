import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { switchToAllRecorded } from '../core/reactive-repository.utils';
import { MailboxBackend } from './mailbox.backend';
import { Mailbox } from './mailbox.model';
import { MailboxRepository } from './mailbox.repository';

@Injectable({
  providedIn: 'root',
})
export class MailboxService {
  private backend = inject(MailboxBackend);
  private repo = inject(MailboxRepository);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.backend.loadMailboxes().pipe(switchToAllRecorded(this.repo));
  }
}
