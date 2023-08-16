import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { AccountService } from '@/app/entity/account/account.service';

import { ACCOUNT_ACTIONS } from './account.actions';

@Injectable()
export class AccountEffects {
  private actions$ = inject(Actions);
  private accountService = inject(AccountService);

  loadAccounts = createEffect(() =>
    this.actions$.pipe(
      ofType(ACCOUNT_ACTIONS.loadAccounts),
      exhaustMap(() =>
        this.accountService.loadAccounts().pipe(
          map((result) => ACCOUNT_ACTIONS.loadAccountsCompleted({ result })),
          catchError((error) =>
            of(ACCOUNT_ACTIONS.loadAccountsFailed({ error })),
          ),
        ),
      ),
    ),
  );
}
