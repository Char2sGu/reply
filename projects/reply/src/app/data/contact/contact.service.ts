import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  switchToAllRecorded,
  switchToRecorded,
} from '../core/reactive-repository.utils';
import { ContactBackend } from './contact.backend';
import { Contact } from './contact.model';
import { ContactRepository } from './contact.repository';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private backend = inject(ContactBackend);
  private contactRepo = inject(ContactRepository);

  loadContacts(): Observable<Contact[]> {
    return this.backend
      .loadContacts()
      .pipe(switchToAllRecorded(this.contactRepo));
  }

  loadContact(id: Contact['id']): Observable<Contact> {
    return this.backend
      .loadContact(id)
      .pipe(switchToRecorded(this.contactRepo));
  }

  loadUser(): Observable<Contact> {
    return this.backend.loadUser().pipe(switchToRecorded(this.contactRepo));
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    return this.backend
      .searchContactsByEmail(email)
      .pipe(switchToAllRecorded(this.contactRepo));
  }
}
