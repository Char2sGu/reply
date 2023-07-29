import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Authorization } from './authorization.model';

@Injectable()
export abstract class AuthenticationBackend {
  abstract requestAuthorization(hint?: string): Observable<Authorization>;
  abstract revokeAuthorization(auth: Authorization): Observable<void>;
}
