import { Injectable } from '@angular/core';

import { ReactiveRepository } from '../core/reactive-repository';
import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailRepository extends ReactiveRepository<Mail> {
  constructor() {
    super();
    MAILS.forEach((mail) => this.insert(mail));
  }

  protected identify(entity: Mail): string {
    return entity.id;
  }
}
