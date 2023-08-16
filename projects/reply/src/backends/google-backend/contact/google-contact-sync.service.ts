import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { access } from '@/app/core/property-path.utils';
import { Contact } from '@/app/entity/contact/contact.model';
import { ContactServiceException } from '@/app/entity/contact/contact.service';
import { ContactSyncService } from '@/app/entity/contact/contact-sync.service';
import { SyncChange, SyncResult } from '@/app/entity/core/synchronization';

import { useGoogleApi as useApi } from '../core/google-apis.utils';
import { injectTokenAggregator } from '../core/token-aggregator.utils';
import { CONTACT_SOURCES, DIR_SOURCES, PERSON_FIELDS } from './constants';
import { GooglePersonResolver } from './google-person-resolver.service';

@Injectable()
export class GoogleContactSyncService implements ContactSyncService {
  private personResolver = inject(GooglePersonResolver);

  private tokenAggregator = injectTokenAggregator<{
    contactSyncToken: string;
    otherContactSyncToken: string;
    directorySyncToken: string | null;
  }>();

  private contactListApi = useApi((a) => a.people.people.connections.list);
  private dirListApi = useApi((a) => a.people.people.listDirectoryPeople);
  private otherContactListApi = useApi((a) => a.people.otherContacts.list);

  obtainSyncToken(): Observable<string> {
    return combineLatest([
      this.obtainContactSyncToken(),
      this.obtainOtherContactSyncToken(),
      this.obtainDirectorySyncToken(),
    ]).pipe(
      map(([contactSyncToken, otherContactSyncToken, directorySyncToken]) =>
        this.tokenAggregator.aggregate({
          ...{ contactSyncToken, otherContactSyncToken, directorySyncToken },
        }),
      ),
    );
  }
  private obtainContactSyncToken(pageToken?: string): Observable<string> {
    return this.contactListApi({
      resourceName: 'people/me',
      personFields: PERSON_FIELDS,
      sources: CONTACT_SOURCES,
      requestSyncToken: true,
      pageToken,
      fields: 'nextPageToken,nextSyncToken',
    }).pipe(
      switchMap(({ nextPageToken, nextSyncToken }) => {
        if (nextSyncToken) return of(nextSyncToken);
        if (nextPageToken) return this.obtainContactSyncToken(nextPageToken);
        throw new ContactServiceException('Invalid response');
      }),
    );
  }
  private obtainOtherContactSyncToken(pageToken?: string): Observable<string> {
    return this.otherContactListApi({
      readMask: PERSON_FIELDS,
      requestSyncToken: true,
      pageToken,
      fields: 'nextPageToken,nextSyncToken',
    }).pipe(
      switchMap(({ nextPageToken, nextSyncToken }) => {
        if (nextSyncToken) return of(nextSyncToken);
        if (nextPageToken)
          return this.obtainOtherContactSyncToken(nextPageToken);
        throw new ContactServiceException('Invalid response');
      }),
    );
  }
  private obtainDirectorySyncToken(): Observable<string | null> {
    return this.dirListApi({
      readMask: PERSON_FIELDS,
      sources: DIR_SOURCES,
      requestSyncToken: true,
      pageSize: 10, // The `nextSyncToken` returned will be invalid if `pageSize` is too small
      fields: 'nextSyncToken',
    }).pipe(
      map((response) => access(response, 'nextSyncToken')),
      catchError(() => of(null)),
    );
  }

  syncChanges(syncToken: string): Observable<SyncResult<Contact>> {
    const syncTokens = this.tokenAggregator.separate(syncToken);
    const personFields = PERSON_FIELDS + ',metadata';
    return combineLatest([
      this.contactListApi({
        resourceName: 'people/me',
        personFields,
        sources: CONTACT_SOURCES,
        syncToken: syncTokens.contactSyncToken,
        requestSyncToken: true,
      }),
      this.otherContactListApi({
        readMask: personFields,
        syncToken: syncTokens.otherContactSyncToken,
        requestSyncToken: true,
      }),
      syncTokens.directorySyncToken
        ? this.dirListApi({
            readMask: personFields,
            sources: DIR_SOURCES,
            syncToken: syncTokens.directorySyncToken,
            requestSyncToken: true,
          }).pipe(catchError(() => of(null)))
        : of(null),
    ]).pipe(
      map(([contactResponse, otherContactResponse, directoryResponse]) => ({
        changes: [
          contactResponse.connections ?? [],
          otherContactResponse.otherContacts ?? [],
          directoryResponse?.people ?? [],
        ]
          .flat()
          .map((p) => this.resolvePersonIntoSyncChange(p)),
        syncToken: this.tokenAggregator.aggregate({
          contactSyncToken: access(contactResponse, 'nextSyncToken'),
          otherContactSyncToken: access(otherContactResponse, 'nextSyncToken'),
          directorySyncToken: directoryResponse?.nextSyncToken ?? null,
        }),
      })),
    );
  }

  private resolvePersonIntoSyncChange(
    person: gapi.client.people.Person,
  ): SyncChange<Contact> {
    if (person.metadata?.deleted) {
      const resolved = this.personResolver.resolvePerson(person);
      return { type: 'deletion', id: resolved.id };
    }
    const contact = this.personResolver.resolveFullPerson(person);
    return { type: 'creation-or-update', id: contact.id, payload: contact };
  }
}
