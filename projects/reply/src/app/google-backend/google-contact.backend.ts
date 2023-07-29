import { Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';

import { InvalidResponseException } from '../core/exceptions';
import { access, asserted } from '../core/property-path.utils';
import { ContactBackend } from '../data/contact/contact.backend';
import { Contact } from '../data/contact/contact.model';
import { useGoogleApi as useApi } from './core/google-apis.utils';

// TODO: avoid 400 missing G-Suite errors

const RESPONSE_FIELDS = 'names,photos,emailAddresses';

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
        personFields: RESPONSE_FIELDS,
        sources: CONTACT_SOURCES,
      }).pipe(map((response) => response.result.connections ?? [])),
      this.otherContactListApi({
        readMask: RESPONSE_FIELDS,
      }).pipe(map((response) => response.result.otherContacts ?? [])),
      this.dirListApi({
        readMask: RESPONSE_FIELDS,
        sources: DIR_SOURCES,
      }).pipe(
        map((response) => response.result.people ?? []),
        catchError(() => of([])),
      ),
    ]).pipe(
      map((results) => results.flat()),
      map((results) =>
        results.flatMap((p) => this.parseFullPersonOrNull(p) ?? []),
      ),
    );
  }

  loadContact(id: string): Observable<Contact> {
    return this.peopleGetApi({
      resourceName: `people/${id}`,
      personFields: RESPONSE_FIELDS,
    }).pipe(
      map((response) => access(response, 'result')),
      map((person) => this.parseFullPerson(person)),
    );
  }

  loadUser(): Observable<Contact> {
    return this.loadContact('me');
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    return combineLatest([
      this.contactSearchApi({
        query: email,
        readMask: RESPONSE_FIELDS,
        sources: CONTACT_SOURCES,
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.otherContactSearchApi({
        query: email,
        readMask: RESPONSE_FIELDS,
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.dirSearchApi({
        query: email,
        readMask: RESPONSE_FIELDS,
        sources: DIR_SOURCES,
      }).pipe(
        map((response) => response.result.people ?? []),
        catchError(() => of([])),
      ),
    ]).pipe(
      map((results) => results.flat()),
      map((results) => results.map((p) => this.parseFullPerson(p))),
    );
  }

  private parsePerson(
    person: gapi.client.people.Person,
  ): Pick<Contact, 'id' | 'temporary'> & Partial<Contact> {
    const { resourceName, names, photos, emailAddresses } = person;
    const id = resourceName?.split('/').pop();
    if (!id) throw new InvalidResponseException();
    const name = names?.find((n) => n.metadata?.primary)?.displayName;
    const photo = photos?.find((p) => p.metadata?.primary);
    const email = emailAddresses?.find((e) => e.metadata?.primary)?.value;
    return {
      id,
      ...(name && { name }),
      ...(email && { email }),
      ...(photo && { avatarUrl: photo.url }),
      temporary: false,
    };
  }

  private parseFullPerson(person: gapi.client.people.Person): Contact {
    const parsed = this.parsePerson(person);
    return asserted(parsed, ['email']);
  }

  private parseFullPersonOrNull(
    person: gapi.client.people.Person,
  ): Contact | null {
    try {
      return this.parseFullPerson(person);
    } catch {
      return null;
    }
  }
}
