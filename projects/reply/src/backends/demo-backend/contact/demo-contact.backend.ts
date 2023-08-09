import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import {
  ContactBackend,
  ContactBackendException,
} from '@/app/entity/contact/contact.backend';
import { Contact } from '@/app/entity/contact/contact.model';
import { SyncResult } from '@/app/entity/core/backend.models';

import { DEMO_CONTACTS } from './demo-contacts.object';

const SYNC_TOKEN = '<contact-sync-token>';

@Injectable()
export class DemoContactBackend implements ContactBackend {
  private contacts = inject(DEMO_CONTACTS);

  loadContacts(): Observable<Contact[]> {
    return of(this.contacts);
  }

  loadContact(id: Contact['id']): Observable<Contact> {
    return of(null).pipe(
      map(() => {
        const contact = this.contacts.find((c) => c.id === id);
        if (!contact)
          throw new ContactBackendException(`Contact ${id} not found`);
        return contact;
      }),
    );
  }

  loadUser(): Observable<Contact> {
    return this.loadContact(`<user>`);
  }

  obtainSyncToken(): Observable<string> {
    return of(SYNC_TOKEN);
  }

  syncContacts(): Observable<SyncResult<Contact>> {
    return of({ changes: [], syncToken: SYNC_TOKEN });
  }
}
