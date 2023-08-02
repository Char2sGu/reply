import { inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, shareReplay, switchMap } from 'rxjs';

import { Contact } from '../data/contact/contact.model';
import { ContactService } from '../data/contact/contact.service';
import { AuthenticationService } from './auth/authentication.service';

export const USER = new InjectionToken<Signal<Contact | null>>('USER', {
  providedIn: 'root',
  factory: () => {
    const authService = inject(AuthenticationService);
    const contactService = inject(ContactService);
    const user$ = authService.authorization$.pipe(
      switchMap((auth) => {
        if (!auth) return of(null);
        return contactService.loadUser();
      }),
      shareReplay(1),
    );
    return toSignal(user$, { initialValue: null });
  },
});
