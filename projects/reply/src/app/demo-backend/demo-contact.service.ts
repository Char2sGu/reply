import { inject, Injectable } from '@angular/core';
import { combineLatest, from, Observable, throwError } from 'rxjs';

import { Contact } from '../data/contact/contact.model';
import { ContactRepository } from '../data/contact/contact.repository';
import {
  ContactService,
  ContactServiceException,
} from '../data/contact/contact.service';
import { DEMO_CONTACTS } from './core/contact/demo-contacts.object';

@Injectable()
export class DemoContactService implements ContactService {
  private contacts = inject(DEMO_CONTACTS);
  private contactRepo = inject(ContactRepository);

  loadContacts(): Observable<Contact[]> {
    return combineLatest(this.contacts.map((c) => this.contactRepo.record(c)));
  }

  loadContact(id: string): Observable<Contact> {
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) {
      const msg = `Contact ${id} not found`;
      return throwError(() => new ContactServiceException(msg));
    }
    return from(this.contactRepo.record(contact));
  }

  loadUser(): Observable<Contact> {
    return this.loadContact(`<user>`);
  }
}
