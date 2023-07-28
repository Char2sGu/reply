import { Injectable } from '@angular/core';

import { Contact } from './contact.model';
import { ReactiveRepository } from './core/reactive-repository';

@Injectable({
  providedIn: 'root',
})
export class ContactRepository extends ReactiveRepository<Contact> {
  identify(entity: Contact): string {
    return entity.id;
  }
}
