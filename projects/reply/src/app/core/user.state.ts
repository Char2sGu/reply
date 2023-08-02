import { inject, InjectionToken } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

import { Contact } from '../data/contact/contact.model';

export const USER = new InjectionToken<BehaviorSubject<Contact | null>>(
  'USER',
  {
    providedIn: 'root',
    factory: () => new BehaviorSubject<Contact | null>(null),
  },
);

export function useUser(): Observable<Contact> {
  return inject(USER).pipe(filter(Boolean));
}
