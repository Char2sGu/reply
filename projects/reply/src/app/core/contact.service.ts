import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import { Contact } from './contact.model';
import { CONTACTS } from './contact.records';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts$ = new BehaviorSubject(CONTACTS);

  constructor() {}

  getContact$ById(id: Contact['id']): Observable<Contact> {
    return this.contacts$.pipe(
      map((items) => items.find((item) => item.id === id)),
      filter((v): v is NonNullable<typeof v> => !!v),
    );
  }
}
