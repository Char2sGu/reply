import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, map, Observable, tap, withLatestFrom } from 'rxjs';

import { Account } from '@/app/entity/account/account.model';
import { AccountRepository } from '@/app/entity/account/account.repository';
import { CORE_ACTIONS } from '@/app/state/core.actions';
import { CORE_STATE } from '@/app/state/core.state-entry';

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

  busy$ = this.store
    .select(CORE_STATE.selectAuthenticationStatus)
    .pipe(map((s) => s.type === 'pending'));

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
