import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import dayjs from 'dayjs/esm';
import { catchError, concatMap, filter, map, of, switchMap, timer } from 'rxjs';

import { AuthenticationService } from '../core/auth/authentication.service';
import { BreakpointService } from '../core/breakpoint.service';
import { AccountService } from '../entity/account/account.service';
import { ContactService } from '../entity/contact/contact.service';
import { CORE_ACTIONS as A } from './core.actions';

@Injectable()
export class CoreEffects {
  private actions$ = inject(Actions);
  private breakpointService = inject(BreakpointService);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private contactService = inject(ContactService);

  updateBreakpoints = createEffect(() =>
    this.breakpointService
      .observeBreakpoints({
        ['tablet-portrait']: '(min-width: 600px)',
        ['tablet-landscape']: '(min-width: 905px)',
        ['laptop']: '(min-width: 1240px)',
        ['desktop']: '(min-width: 1440px)',
      })
      .pipe(map((to) => A.breakpointsUpdated({ to }))),
  );

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
