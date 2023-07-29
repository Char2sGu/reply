import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { InvalidResponseException } from '../core/exceptions';
import { access, asserted } from '../core/property-path.utils';
import { Contact } from '../data/contact/contact.model';
import { ContactRepository } from '../data/contact/contact.repository';
import { ContactService } from '../data/contact/contact.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleContactService implements ContactService {
  private contactRepo = inject(ContactRepository);

  private peopleGetApi = useGoogleApi((a) => a.people.people.get);
  private peopleListApi = useGoogleApi((a) => a.people.people.connections.list);
  private peopleSearchApi = useGoogleApi((a) => a.people.people.searchContacts);

  // TODO: implement
  loadContacts(): Observable<Contact[]> {
    return of([]);
    // return this.peopleListApi({
    //   resourceName: 'people/me',
    //   personFields: 'photos,emailAddresses',
    // }).pipe(
    //   map((response) => response.result.connections ?? []), // response would be empty if no contacts
    //   map((people) => people.map((p) => this.parseFullPersonAndSave(p))),
    //   switchMap((contactStreams) => combineLatest(contactStreams)),
    // );
  }

  loadContact(id: string): Observable<Contact> {
    return this.peopleGetApi({
      resourceName: `people/${id}`,
      personFields: 'names,photos,emailAddresses',
    }).pipe(
      map((response) => access(response, 'result')),
      switchMap((person) => this.parseFullPersonAndSave(person)),
    );
  }

  loadUser(): Observable<Contact> {
    return this.loadContact('me');
  }

  private parsePerson(
    person: gapi.client.people.Person,
  ): Pick<Contact, 'id'> & Partial<Contact> {
    const { resourceName, names, photos, emailAddresses } = person;
    const id = resourceName.split('/').pop();
    if (!id) throw new InvalidResponseException();
    const name = names.find((n) => n.metadata?.primary)?.displayName;
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

  private parseFullPersonAndSave(
    person: gapi.client.people.Person,
  ): Observable<Contact> {
    const contact = this.parseFullPerson(person);
    return from(this.contactRepo.record(contact));
  }
}
