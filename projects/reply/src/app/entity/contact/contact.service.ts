import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Exception } from '@/app/core/exceptions';

import { Contact } from './contact.model';

@Injectable()
export abstract class ContactService {
  abstract loadContacts(): Observable<Contact[]>;
  abstract loadContact(id: Contact['id']): Observable<Contact>;
  abstract loadUser(): Observable<Contact>;
}

export class ContactServiceException extends Exception {}
