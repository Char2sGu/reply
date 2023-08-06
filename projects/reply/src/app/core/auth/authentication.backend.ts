import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Exception } from '../exceptions';
import { Authorization } from './authorization.service';

@Injectable()
export abstract class AuthenticationBackend {
  abstract requestAuthorization(hint?: string): Observable<Authorization>;
  abstract revokeAuthorization(auth: Authorization): Observable<void>;
}

export class AuthenticationBackendException extends Exception {}
export class AuthorizationRequestCancelledException extends AuthenticationBackendException {}
