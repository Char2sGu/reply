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

  readonly authorization$ = new BehaviorSubject<Authorization | null>(
    AUTHORIZATION,
  );

  readonly authorized$ = this.authorization$.pipe(map(Boolean));

  readonly user$ = this.contactRepo.retrieve('user');

  setAuthorization(): boolean {
    return false;
  }

  requestAuthorization(): void {
    this.authorization$.next(AUTHORIZATION);
  }

  revokeAuthorization(): void {
    this.authorization$.next(null);
  }
}
