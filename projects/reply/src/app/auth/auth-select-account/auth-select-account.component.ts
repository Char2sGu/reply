import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, map, Observable, tap, withLatestFrom } from 'rxjs';

import { CORE_ACTIONS } from '@/app/core/state/core.actions';
import { CORE_STATE } from '@/app/core/state/core.state-entry';
import { Account } from '@/app/data/account/account.model';
import { AccountRepository } from '@/app/data/account/account.repository';

@Component({
  selector: 'rpl-auth-select-account',
  templateUrl: './auth-select-account.component.html',
  styleUrls: ['./auth-select-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSelectAccountComponent {
  private accountRepo = inject(AccountRepository);
  private store = inject(Store);

  itemButtonClick = new EventEmitter<Account>();
  addButtonClick = new EventEmitter();

  busy$ = this.store.select(CORE_STATE.selectAuthenticating);

  accounts = toSignal(this.queryAccountsAndSort(), { requireSync: true });

  constructor() {
    this.itemButtonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([, busy]) => !busy),
        tap(([account]) =>
          this.store.dispatch(CORE_ACTIONS.authenticate({ hint: account.id })),
        ),
      )
      .subscribe();
  }

  private queryAccountsAndSort(): Observable<Account[]> {
    return this.accountRepo
      .query()
      .pipe(
        map((accounts) =>
          accounts.sort(
            (a, b) => b.authorizedAt.getTime() - a.authorizedAt.getTime(),
          ),
        ),
      );
  }
}