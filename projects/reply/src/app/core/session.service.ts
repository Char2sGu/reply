import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Account } from '../data/account/account.model';
import { Contact } from '../data/contact/contact.model';
import { AuthorizationService } from './auth/authorization.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private authService = inject(AuthorizationService);

  readonly authorized$ = this.authService.authorization$.pipe(map(Boolean));

  #user$ = new BehaviorSubject<Contact | null>(null);
  readonly user$ = this.#user$.pipe();

  setUser(user: Contact): void {
    this.#user$.next(user);
  }

  #account$ = new BehaviorSubject<Account | null>(null);
  readonly account$ = this.#account$.pipe();

  setAccount(account: Account): void {
    this.#account$.next(account);
  }
}
