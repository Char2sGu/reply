import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { access } from '../core/property-path.utils';
import { ContactBackend } from '../data/contact/contact.backend';
import { Contact } from '../data/contact/contact.model';
import { SyncChange, SyncResult } from '../data/core/backend.models';
import { useGoogleApi as useApi } from './core/google-apis.utils';
import { GooglePersonResolver } from './core/google-person-resolver.service';

// TODO: avoid 400 missing G-Suite errors

const PERSON_FIELDS = 'names,photos,emailAddresses';

const CONTACT_SOURCES = [
  'READ_SOURCE_TYPE_CONTACT',
  'READ_SOURCE_TYPE_PROFILE',
  'READ_SOURCE_TYPE_DOMAIN_CONTACT',
];

const DIR_SOURCES = [
  'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE',
  'DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT',
];

@Injectable()
export class GoogleContactBackend implements ContactBackend {
  private personResolver = inject(GooglePersonResolver);

  private peopleGetApi = useApi((a) => a.people.people.get);
  private contactListApi = useApi((a) => a.people.people.connections.list);
  private contactSearchApi = useApi((a) => a.people.people.searchContacts);
  private dirListApi = useApi((a) => a.people.people.listDirectoryPeople);
  private dirSearchApi = useApi((a) => a.people.people.searchDirectoryPeople);
  private otherContactListApi = useApi((a) => a.people.otherContacts.list);
  private otherContactSearchApi = useApi((a) => a.people.otherContacts.search);

  loadContacts(): Observable<Contact[]> {
    return combineLatest([
      this.contactListApi({
        resourceName: 'people/me',
        personFields: PERSON_FIELDS,
        sources: CONTACT_SOURCES,
      }).pipe(map((response) => response.result.connections ?? [])),
      this.otherContactListApi({
        readMask: PERSON_FIELDS,
      }).pipe(map((response) => response.result.otherContacts ?? [])),
      this.dirListApi({
        readMask: PERSON_FIELDS,
        sources: DIR_SOURCES,
      }).pipe(
        map((response) => response.result.people ?? []),
        catchError(() => of([])),
      ),
    ]).pipe(
      map((results) => results.flat()),
      map((results) =>
        results.flatMap(
          (p) => this.personResolver.resolveFullPersonOrNull(p) ?? [],
        ),
      ),
    );
  }

  loadContact(id: string): Observable<Contact> {
    return this.peopleGetApi({
      resourceName: `people/${id}`,
      personFields: PERSON_FIELDS,
    }).pipe(
      map((response) => access(response, 'result')),
      map((person) => this.personResolver.resolveFullPerson(person)),
    );
  }

  loadUser(): Observable<Contact> {
    return this.loadContact('me');
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    return combineLatest([
      this.contactSearchApi({
        query: email,
        readMask: PERSON_FIELDS,
        sources: CONTACT_SOURCES,
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.otherContactSearchApi({
        query: email,
        readMask: PERSON_FIELDS,
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.dirSearchApi({
        query: email,
        readMask: PERSON_FIELDS,
        sources: DIR_SOURCES,
      }).pipe(
        map((response) => response.result.people ?? []),
        catchError(() => of([])),
      ),
    ]).pipe(
      map((results) => results.flat()),
      map((results) =>
        results.map((p) => this.personResolver.resolveFullPerson(p)),
      ),
    );
  }

  obtainSyncToken(): Observable<string> {
    return combineLatest([
      this.obtainContactSyncToken(),
      this.obtainOtherContactSyncToken(),
      this.obtainDirectorySyncToken(),
    ]).pipe(
      map(([contactSyncToken, otherContactSyncToken, directorySyncToken]) =>
        this.createAggregatedSyncToken({
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
      switchMap(({ result: { nextPageToken, nextSyncToken } }) => {
        if (nextSyncToken) return of(nextSyncToken);
        if (nextPageToken) return this.obtainContactSyncToken(nextPageToken);
        throw new Error('Invalid response');
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
      switchMap(({ result: { nextPageToken, nextSyncToken } }) => {
        if (nextSyncToken) return of(nextSyncToken);
        if (nextPageToken)
          return this.obtainOtherContactSyncToken(nextPageToken);
        throw new Error('Invalid response');
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
      map((response) => access(response.result, 'nextSyncToken')),
      catchError(() => of(null)),
    );
  }

  syncContacts(syncToken: string): Observable<SyncResult<Contact>> {
    const syncTokens = this.parseAggregatedSyncToken(syncToken);
    const personFields = PERSON_FIELDS + ',metadata';
    return combineLatest([
      this.contactListApi({
        resourceName: 'people/me',
        personFields,
        sources: CONTACT_SOURCES,
        syncToken: syncTokens.contactSyncToken,
        requestSyncToken: true,
      }).pipe(map((r) => r.result)),
      this.otherContactListApi({
        readMask: personFields,
        syncToken: syncTokens.otherContactSyncToken,
        requestSyncToken: true,
      }).pipe(map((r) => r.result)),
      syncTokens.directorySyncToken
        ? this.dirListApi({
            readMask: personFields,
            sources: DIR_SOURCES,
            syncToken: syncTokens.directorySyncToken,
            requestSyncToken: true,
          }).pipe(
            map((r) => r.result),
            catchError(() => of(null)),
          )
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
        syncToken: this.createAggregatedSyncToken({
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
      return {
        type: 'deletion',
        id: resolved.id,
      };
    }
    const contact = this.personResolver.resolveFullPerson(person);
    return {
      type: 'creation-or-update',
      id: contact.id,
      payload: contact,
    };
  }

  private createAggregatedSyncToken(
    content: AggregatedSyncTokenContent,
  ): string {
    return JSON.stringify(content);
  }
  private parseAggregatedSyncToken(token: string): AggregatedSyncTokenContent {
    return JSON.parse(token);
  }
}

interface AggregatedSyncTokenContent {
  contactSyncToken: string;
  otherContactSyncToken: string;
  directorySyncToken: string | null;
}
