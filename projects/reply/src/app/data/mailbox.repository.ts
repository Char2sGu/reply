import { Injectable } from '@angular/core';

import { ReactiveRepository } from './core/reactive-repository';
import { Mailbox } from './mailbox.model';

@Injectable({
  providedIn: 'root',
})
export class MailboxRepository extends ReactiveRepository<Mailbox> {
  identify(entity: Mailbox): string {
    return entity.id;
  }
}
