import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationBackend } from './authentication.backend';
import { Authorization } from './authorization.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backend = inject(AuthenticationBackend);

  requestAuthorization(hint?: string): Observable<Authorization | null> {
    return this.backend.requestAuthorization(hint);
  }

  revokeAuthorization(auth: Authorization): Observable<void> {
    return this.backend.revokeAuthorization(auth);
  }
}
