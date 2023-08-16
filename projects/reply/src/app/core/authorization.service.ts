import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Authorization } from './authorization.model';
import { Exception } from './exceptions';

// TODO: rename to authorization service
// prettier-ignore
@Injectable()
export abstract class AuthenticationService {
  abstract requestAuthorization(hint?: string): Observable<Authorization | null>;
  abstract revokeAuthorization(auth: Authorization): Observable<void>;
}

export class AuthenticationServiceException extends Exception {}
