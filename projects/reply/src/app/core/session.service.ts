import { inject, Injectable } from '@angular/core';
import { of, shareReplay, switchMap } from 'rxjs';

import { ContactService } from '../data/contact/contact.service';
import { AuthenticationService } from './auth/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactService);

  readonly user$ = this.authService.authorization$.pipe(
    switchMap((auth) => (auth ? this.contactService.loadUser() : of(null))),
    shareReplay(1),
  );
}
