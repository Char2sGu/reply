import { inject, Injectable } from '@angular/core';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';

import { ActionFlow } from '@/app/core/action-flow';
import { AuthenticationConductor } from '@/app/core/auth/authentication.conductor';
import { SessionService } from '@/app/core/session.service';
import { AccountConductor } from '@/app/data/account/account.conductor';
import { ContactConductor } from '@/app/data/contact/contact.conductor';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateActionFlow implements ActionFlow {
  private sessionService = inject(SessionService);
  private authConductor = inject(AuthenticationConductor);
  private contactConductor = inject(ContactConductor);
  private accountConductor = inject(AccountConductor);

  execute(payload?: { hint?: string }): Observable<boolean> {
    return this.authConductor.requestAuthorization(payload?.hint).pipe(
      switchMap((success) => {
        if (!success) return of(false);
        return of(null).pipe(
          switchMap(() => this.contactConductor.loadUser()),
          first(),
          tap((user) => this.sessionService.setUser(user)),
          switchMap((user) => this.accountConductor.saveAccount(user)),
          first(),
          tap((account) => this.sessionService.setAccount(account)),
          map(() => true),
        );
      }),
    );
  }
}
