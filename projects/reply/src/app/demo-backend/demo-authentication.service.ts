import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import {
  AuthenticationService,
  Authorization,
} from '../core/authentication.service';
import { ContactRepository } from '../data/contact.repository';

const AUTHORIZATION: Authorization = {
  token: 'demo',
  issuedAt: new Date(),
  expiresIn: -1,
};

@Injectable()
export class DemoAuthenticationService implements AuthenticationService {
  private contactRepo = inject(ContactRepository);

  readonly authorization$ = new BehaviorSubject<Authorization | null>(null);
  readonly authorized$ = this.authorization$.pipe(map(Boolean));
  readonly user$ = this.contactRepo.retrieve('user');

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
