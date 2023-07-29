import { inject, Injectable } from '@angular/core';
import { concatMap, map, Observable, of, switchMap } from 'rxjs';

import {
  switchToAllRecorded,
  switchToRecorded,
} from '../core/reactive-repository.utils';
import { ContactBackend } from './contact.backend';
import { Contact } from './contact.model';
import { ContactRepository } from './contact.repository';

// TODO: too many requests

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private backend = inject(ContactBackend);
  private repo = inject(ContactRepository);

  loadContacts(): Observable<Contact[]> {
    return this.backend.loadContacts().pipe(switchToAllRecorded(this.repo));
  }

  loadContact(id: Contact['id']): Observable<Contact> {
    return this.backend.loadContact(id).pipe(switchToRecorded(this.repo));
  }

  loadUser(): Observable<Contact> {
    return this.backend.loadUser().pipe(switchToRecorded(this.repo));
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    return this.backend
      .searchContactsByEmail(email)
      .pipe(switchToAllRecorded(this.repo));
  }

  resolveEmailAndName(email: string, name?: string): Observable<Contact> {
    const contactFromRepo$ = this.repo.queryOne((e) => e.email === email);
    const contactFromSearch$ = this.searchContactsByEmail(email).pipe(
      map((contacts) => contacts.find((c) => c.email === email)),
    );
    return contactFromRepo$.pipe(
      switchMap((contact) => (contact ? of(contact) : contactFromSearch$)),
      concatMap((contact) =>
        contact ? of(contact) : this.repo.insert({ id: email, name, email }),
      ),
    );
  }
}
