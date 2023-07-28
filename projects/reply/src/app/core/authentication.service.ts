import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from '../data/contact.model';

@Injectable()
export abstract class AuthenticationService {
  abstract readonly authorization$: Observable<Authorization | null>;
  abstract readonly authorized$: Observable<boolean>;
  abstract readonly user$: Observable<Contact>;
  abstract setAuthorization(auth: Authorization): boolean;
  abstract requestAuthorization(hint?: string): void;
  abstract revokeAuthorization(): void;
}

export interface Authorization {
  token: string;
  issuedAt: Date;
  lifespan: number;
}
