import { Injectable } from '@angular/core';

import { ReactiveRepository } from './core/reactive-repository';
import { Mail } from './mail.model';

@Injectable({
  providedIn: 'root',
})
export class MailRepository extends ReactiveRepository<Mail> {
  identify(entity: Mail): string {
    return entity.id;
  }
}
