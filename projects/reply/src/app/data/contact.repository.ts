import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReactiveIdentityMap } from '../common/reactivity';
import { EntityNotFoundException } from '../core/exceptions';
import { Contact } from './contact.model';
import { CONTACTS } from './contact.records';

@Injectable({
  providedIn: 'root',
})
export class ContactRepository {
  private entities = [...CONTACTS];
  private reactivity = new ReactiveIdentityMap<Contact>();

  constructor() {}

  retrieve(id: Contact['id']): Observable<Contact> {
    const entity = this.entities.find((item) => item.id === id);
    if (!entity) throw new EntityNotFoundException();
    this.reactivity.set(id, entity);
    return this.reactivity.get(id);
  }
}
