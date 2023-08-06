import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import { Contact } from '../contact/contact.model';
import {
  switchMapToAllRecorded,
  switchMapToRecorded,
} from '../core/reactive-repository.utils';
import { Account } from './account.model';
import { AccountRepository } from './account.repository';
import { AccountIdentifier } from './account-identifier.service';
import { AccountResource } from './account-resource.service';

@Injectable({
  providedIn: 'root',
})
export class AccountConductor {
  private identifier = inject(AccountIdentifier);
  private repo = inject(AccountRepository);
  private resource = inject(AccountResource);

  loadAccounts(): Observable<Account[]> {
    return of(null).pipe(
      map(() => this.resource.list()),
      switchMapToAllRecorded(this.repo),
    );
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
      switchMapToRecorded(this.repo),
    );
  }

  deleteAccount(account: Account): Observable<void> {
    return of(null).pipe(
      tap(() => {
        this.resource.delete(account.id);
        this.repo.delete(account.id);
      }),
      map(() => undefined),
    );
  }
}
