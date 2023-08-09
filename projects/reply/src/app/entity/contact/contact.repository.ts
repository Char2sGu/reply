import { Injectable } from '@angular/core';

import { ReactiveRepository } from '../core/reactive-repository';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactRepository extends ReactiveRepository<Contact> {
  identify(entity: Contact): string {
    return entity.id;
  }
}
