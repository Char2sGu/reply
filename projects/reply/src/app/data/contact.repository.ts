import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EntityCollection, ReactiveRepository } from '../common/repository';
import { Contact } from './contact.model';
import { CONTACTS } from './contact.records';

@Injectable({
  providedIn: 'root',
})
export class ContactRepository extends ReactiveRepository<Contact> {
  private entities = new EntityCollection(...CONTACTS);

  retrieve(id: Contact['id']): Observable<Contact> {
    const entity = this.entities.findOrThrow((item) => item.id === id);
    return this.reactivityFor(entity);
  }

  protected identify(entity: Contact): string {
    return entity.id;
  }
}
