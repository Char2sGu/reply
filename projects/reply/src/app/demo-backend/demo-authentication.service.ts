import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs';

import {
  AuthenticationService,
  Authorization,
} from '../core/authentication.service';
import { ContactService } from '../data/contact/contact.service';

const AUTHORIZATION: Authorization = {
  token: 'demo',
  issuedAt: new Date(),
  lifespan: -1,
};

@Injectable()
export class DemoAuthenticationService implements AuthenticationService {
  private contactService = inject(ContactService);

  readonly authorization$ = new BehaviorSubject<Authorization | null>(null);
  readonly authorized$ = this.authorization$.pipe(
    map(Boolean),
    distinctUntilChanged(),
    shareReplay(1),
  );
  readonly user$ = this.contactService.loadUser();

  setAuthorization(auth: Authorization): boolean {
    this.authorization$.next(auth);
    return true;
  }

  requestAuthorization(): void {
    this.setAuthorization(AUTHORIZATION);
  }

  revokeAuthorization(): void {
    this.authorization$.next(null);
  }
}
