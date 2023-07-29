import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { InvalidResponseException } from '../core/exceptions';
import { access, asserted } from '../core/property-path.utils';
import { ContactBackend } from '../data/contact/contact.backend';
import { Contact } from '../data/contact/contact.model';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleContactBackend implements ContactBackend {
  private peopleGetApi = useGoogleApi((a) => a.people.people.get);

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
