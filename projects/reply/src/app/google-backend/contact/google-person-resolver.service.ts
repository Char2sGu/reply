import { Injectable } from '@angular/core';

import { Exception } from '@/app/core/exceptions';
import { asserted } from '@/app/core/property-path.utils';
import { Contact } from '@/app/entity/contact/contact.model';

@Injectable({
  providedIn: 'root',
})
export class GooglePersonResolver {
  resolvePerson(
    person: gapi.client.people.Person,
  ): Pick<Contact, 'id'> & Partial<Contact> {
    const { resourceName, names, photos, emailAddresses } = person;
    const id = resourceName?.split('/').pop();
    if (!id) {
      const msg = 'Failed to parse person resource name';
      throw new GooglePersonResolveException(msg);
    }
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

  resolveFullPerson(person: gapi.client.people.Person): Contact {
    const resolved = this.resolvePerson(person);
    return asserted(resolved, ['email']);
  }

  resolveFullPersonOrNull(person: gapi.client.people.Person): Contact | null {
    try {
      return this.resolveFullPerson(person);
    } catch {
      return null;
    }
  }
}

export class GooglePersonResolveException extends Exception {}
