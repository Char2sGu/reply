import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { Contact } from '@/app/entity/contact/contact.model';
import {
  ContactService,
  ContactServiceException,
} from '@/app/entity/contact/contact.service';
import { ContactSyncService } from '@/app/entity/contact/contact-sync.service';
import { SyncResult } from '@/app/entity/core/synchronization';

import { DEMO_CONTACTS } from './demo-contacts.object';

const SYNC_TOKEN = '<contact-sync-token>';

@Injectable()
export class DemoContactService implements ContactService, ContactSyncService {
  private contacts = inject(DEMO_CONTACTS);

  loadContacts(): Observable<Contact[]> {
    return of(this.contacts);
  }

  loadContact(id: Contact['id']): Observable<Contact> {
    return of(null).pipe(
      map(() => {
        const contact = this.contacts.find((c) => c.id === id);
        if (!contact)
          throw new ContactServiceException(`Contact ${id} not found`);
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

  syncChanges(): Observable<SyncResult<Contact>> {
    return of({ changes: [], syncToken: SYNC_TOKEN });
  }
}
