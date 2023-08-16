import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Exception } from '../exceptions';
import { Authorization } from './authorization.model';

// TODO: rename to authorization service
// prettier-ignore
@Injectable()
export abstract class AuthenticationService {
  abstract requestAuthorization(hint?: string): Observable<Authorization | null>;
  abstract revokeAuthorization(auth: Authorization): Observable<void>;
}

export class AuthenticationServiceException extends Exception {}
