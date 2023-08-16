import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import dayjs from 'dayjs';
import { catchError, concatMap, filter, map, of, switchMap, timer } from 'rxjs';

import { AccountService } from '@/app/entity/account/account.service';
import { ContactService } from '@/app/entity/contact/contact.service';

import { AuthenticationService } from './auth/authentication.service';
import { AUTHENTICATION_ACTIONS as A } from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactService);
  private accountService = inject(AccountService);

  authenticate = createEffect(() =>
    this.actions$.pipe(
      ofType(A.authenticate),
      concatMap((params) =>
        this.authService.requestAuthorization(params.hint).pipe(
          switchMap((authorization) => {
            if (!authorization) return of(A.authenticateCancelled({ params }));
            return of(null).pipe(
              concatMap(() => this.contactService.loadUser()),
              concatLatestFrom((user) => this.accountService.saveAccount(user)),
              map(([user, account]) => ({ authorization, user, account })),
              map((result) => A.authenticateCompleted({ params, result })),
            );
          }),
          catchError((error) => of(A.authenticateFailed({ params, error }))),
        ),
      ),
    ),
  );

  authenticationExpirer = createEffect(() =>
    this.actions$.pipe(
      ofType(A.authenticateCompleted),
      switchMap(({ result: { authorization }, params }) => {
        const issueDate = dayjs(authorization.issuedAt);
        const expireDate = issueDate.add(authorization.lifespan, 'seconds');
        const isAboutToExpire = () =>
          dayjs().add(1, 'minute').isAfter(expireDate);
        const interval = 30 * 1000;
        return timer(interval, interval).pipe(
          filter(() => isAboutToExpire()),
          map(() => A.authenticateExpired({ params })),
        );
      }),
    ),
  );
}
