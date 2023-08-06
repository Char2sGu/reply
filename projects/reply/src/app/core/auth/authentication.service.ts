import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { AccountConductor } from '@/app/data/account/account.conductor';
import { ContactConductor } from '@/app/data/contact/contact.conductor';

import { AuthenticationBackend } from './authentication.backend';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthenticationService {
  private backend = inject(AuthenticationBackend);
  private authService = inject(AuthorizationService);
  private contactConductor = inject(ContactConductor);
  private accountConductor = inject(AccountConductor);

  readonly authorized$ = this.authService.authorization$.pipe(map(Boolean));

  readonly user$ = this.authorized$.pipe(
    switchMap((authorized) => {
      if (!authorized) return of(null);
      return this.contactConductor.loadUser();
    }),
    shareReplay(1),
  );

  readonly account$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      return this.accountConductor.saveAccount(user);
    }),
    shareReplay(1),
  );

  requestAuthorization(hint?: string): Observable<boolean> {
    return this.backend.requestAuthorization(hint).pipe(
      map((auth) => this.authService.setAuthorization(auth)),
      catchError(() => of(false)),
    );
  }

  revokeAuthorization(): Observable<void> {
    return this.authService.authorization$.pipe(
      switchMap((auth) => {
        if (!auth) return of(undefined);
        return this.backend.revokeAuthorization(auth);
      }),
    );
  }
}
