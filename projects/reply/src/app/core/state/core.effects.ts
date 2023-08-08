import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import { AccountConductor } from '@/app/data/account/account.conductor';
import { ContactConductor } from '@/app/data/contact/contact.conductor';

import { AuthenticationService } from '../auth/authentication.service';
import { CORE_ACTIONS } from './core.actions';
import { CORE_STATE } from './core.state-entry';

@Injectable()
export class CoreEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactConductor);
  private accountService = inject(AccountConductor);

  authenticate = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.authenticate),
      switchMap((a) => this.authService.requestAuthorization(a.hint)),
      map((result) =>
        result
          ? CORE_ACTIONS.authenticateCompleted({ result })
          : CORE_ACTIONS.authenticateCancelled(),
      ),
      catchError((error) => of(CORE_ACTIONS.authenticateFailed({ error }))),
    ),
  );

  loadUser = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadUser, CORE_ACTIONS.authenticateCompleted),
      switchMap(() => this.contactService.loadUser()),
      map((result) => CORE_ACTIONS.loadUserCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadUserFailed({ error }))),
    ),
  );

  loadAccount = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadAccount, CORE_ACTIONS.loadUserCompleted),
      switchMap(() => this.store.select(CORE_STATE.selectUser)),
      filter(Boolean),
      switchMap((user) => this.accountService.saveAccount(user)),
      map((result) => CORE_ACTIONS.loadAccountCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadAccountFailed({ error }))),
    ),
  );
}
