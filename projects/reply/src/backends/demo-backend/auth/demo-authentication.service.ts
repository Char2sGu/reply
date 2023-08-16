import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Authorization } from '@/app/core/authorization.model';
import { AuthenticationService } from '@/app/core/authorization.service';

const AUTHORIZATION: Authorization = {
  token: 'demo',
  issuedAt: new Date(),
  lifespan: 99999999999,
};

@Injectable()
export class DemoAuthenticationService implements AuthenticationService {
  requestAuthorization(): Observable<Authorization> {
    return of(AUTHORIZATION);
  }
  revokeAuthorization(): Observable<void> {
    return of(undefined);
  }
}
