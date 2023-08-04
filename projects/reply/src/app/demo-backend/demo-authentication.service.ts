import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  AuthenticationService,
  Authorization,
} from '../core/auth/authentication.service';
import { ContactConductor } from '../data/contact/contact.conductor';

const AUTHORIZATION: Authorization = {
  token: 'demo',
  issuedAt: new Date(),
  lifespan: -1,
};

@Injectable()
export class DemoAuthenticationService implements AuthenticationService {
  private contactConductor = inject(ContactConductor);

  readonly authorization$ = new BehaviorSubject<Authorization | null>(null);
  readonly user$ = this.contactConductor.loadUser();

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
