import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Exception } from '@/app/core/exceptions';

import { SyncResult } from '../core/backend.models';
import { Contact } from './contact.model';

@Injectable()
export abstract class ContactBackend {
  abstract loadContacts(): Observable<Contact[]>;
  abstract loadContact(id: Contact['id']): Observable<Contact>;
  abstract loadUser(): Observable<Contact>;
  abstract searchContactsByEmail(email: string): Observable<Contact[]>;
  abstract obtainSyncToken(): Observable<string>;
  abstract syncContacts(syncToken: string): Observable<SyncResult<Contact>>;
}

export class ContactBackendException extends Exception {}
