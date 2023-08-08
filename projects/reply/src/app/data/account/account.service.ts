import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import { Contact } from '../contact/contact.model';
import { Account } from './account.model';
import { AccountIdentifier } from './account-identifier.service';
import { AccountResource } from './account-resource.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private identifier = inject(AccountIdentifier);
  private resource = inject(AccountResource);

  loadAccounts(): Observable<Account[]> {
    return of(null).pipe(map(() => this.resource.list()));
  }

  saveAccount(profile: Contact): Observable<Account> {
    return of(null).pipe(
      map(
        (): Account => ({
          id: this.identifier.identify(profile),
          profile: profile.id,
          authorizedAt: new Date(),
        }),
      ),
      tap((account) => this.resource.put(account)),
    );
  }

  revokeAccount(account: Account): Observable<Account> {
    return of(null).pipe(
      map((): Account => ({ ...account, revokedAt: new Date() })),
      tap((account) => this.resource.patch(account.id, account)),
    );
  }

  deleteAccount(account: Account): Observable<void> {
    return of(null).pipe(
      tap(() => this.resource.delete(account.id)),
      map(() => undefined),
    );
  }
}
