import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';

import { InvalidResponseException } from '../core/exceptions';
import { access, asserted } from '../core/property-path.utils';
import { ContactBackend } from '../data/contact/contact.backend';
import { Contact } from '../data/contact/contact.model';
import { useGoogleApi as useApi } from './core/google-apis.utils';

@Injectable()
export class GoogleContactBackend implements ContactBackend {
  private peopleGetApi = useApi((a) => a.people.people.get);
  private contactSearchApi = useApi((a) => a.people.people.searchContacts);
  private dirSearchApi = useApi((a) => a.people.people.searchDirectoryPeople);
  private otherContactSearchApi = useApi((a) => a.people.otherContacts.search);

  // TODO: implement
  loadContacts(): Observable<Contact[]> {
    return of([]);
  }

  loadContact(id: string): Observable<Contact> {
    return this.peopleGetApi({
      resourceName: `people/${id}`,
      personFields: 'names,photos,emailAddresses',
    }).pipe(
      map((response) => access(response, 'result')),
      map((person) => this.parseFullPerson(person)),
    );
  }

  loadUser(): Observable<Contact> {
    return this.loadContact('me');
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    const readMask = 'names,photos,emailAddresses';
    return combineLatest([
      this.contactSearchApi({
        query: email,
        readMask,
        sources: [
          'READ_SOURCE_TYPE_CONTACT',
          'READ_SOURCE_TYPE_PROFILE',
          'READ_SOURCE_TYPE_DOMAIN_CONTACT',
        ],
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.otherContactSearchApi({
        query: email,
        readMask,
      }).pipe(
        map((response) => response.result.results ?? []),
        map((results) => results.flatMap((r) => (r.person ? [r.person] : []))),
      ),
      this.dirSearchApi({
        query: email,
        readMask,
        sources: [
          'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE',
          'DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT', // TODO: check if this would cause duplicates
        ],
      }).pipe(map((response) => response.result.people ?? [])),
    ]).pipe(
      map((results) => results.flat()),
      map((results) => results.map((p) => this.parseFullPerson(p))),
    );
  }

  private parsePerson(
    person: gapi.client.people.Person,
  ): Pick<Contact, 'id'> & Partial<Contact> {
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
    };
  }

  private parseFullPerson(person: gapi.client.people.Person): Contact {
    const parsed = this.parsePerson(person);
    return asserted(parsed, ['name', 'email', 'avatarUrl']);
  }
}
