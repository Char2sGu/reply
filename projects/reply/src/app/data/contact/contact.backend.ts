import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from './contact.model';

@Injectable()
export abstract class ContactBackend {
  abstract loadContacts(): Observable<Contact[]>;
  abstract loadContact(id: Contact['id']): Observable<Contact>;
  abstract loadUser(): Observable<Contact>;
}
