import { inject, Injectable } from '@angular/core';
import { combineLatest, from, Observable, throwError } from 'rxjs';

import { Contact } from '../data/contact.model';
import { ContactRepository } from '../data/contact.repository';
import { ContactService } from '../data/contact.service';
import { DEMO_CONTACTS } from './core/contact/demo-contacts.token';

@Injectable()
export class DemoContactService implements ContactService {
  private contacts = inject(DEMO_CONTACTS);
  private contactRepo = inject(ContactRepository);

  loadContacts(): Observable<Contact[]> {
    return combineLatest(
      this.contacts.map((c) => this.contactRepo.insertOrPatch(c)),
    );
  }

  loadContact(id: string): Observable<Contact> {
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) return throwError(() => new Error(`Contact ${id} not found`));
    return from(this.contactRepo.insertOrPatch(contact));
  }

  loadUser(): Observable<Contact> {
    return this.loadContact(`<user>`);
  }
}
