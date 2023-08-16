import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';

import { Contact } from '@/app/entity/contact/contact.model';
import { ContactService } from '@/app/entity/contact/contact.service';

import { useGoogleApi as useApi } from '../core/google-apis.utils';
import { CONTACT_SOURCES, DIR_SOURCES, PERSON_FIELDS } from './constants';
import { GooglePersonResolver } from './google-person-resolver.service';

@Injectable()
export class GoogleContactService implements ContactService {
  private personResolver = inject(GooglePersonResolver);

  private peopleGetApi = useApi((a) => a.people.people.get);
  private contactListApi = useApi((a) => a.people.people.connections.list);
  private dirListApi = useApi((a) => a.people.people.listDirectoryPeople);
  private otherContactListApi = useApi((a) => a.people.otherContacts.list);

  loadContacts(): Observable<Contact[]> {
    return combineLatest([
      this.contactListApi({
        resourceName: 'people/me',
        personFields: PERSON_FIELDS,
        sources: CONTACT_SOURCES,
      }).pipe(map((response) => response.connections ?? [])),
      this.otherContactListApi({
        readMask: PERSON_FIELDS,
      }).pipe(map((response) => response.otherContacts ?? [])),
      this.dirListApi({
        readMask: PERSON_FIELDS,
        sources: DIR_SOURCES,
      }).pipe(
        map((response) => response.people ?? []),
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
    }).pipe(map((person) => this.personResolver.resolveFullPerson(person)));
  }

  loadUser(): Observable<Contact> {
    return this.loadContact('me');
  }
}
