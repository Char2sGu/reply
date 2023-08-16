import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs';

import { Account } from '@/app/entity/account/account.model';
import { ACCOUNT_STATE } from '@/app/state/account/account.state-entry';
import { CORE_ACTIONS } from '@/app/state/core.actions';
import { CORE_STATE } from '@/app/state/core.state-entry';

@Component({
  selector: 'rpl-auth-select-account',
  templateUrl: './auth-select-account.component.html',
  styleUrls: ['./auth-select-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSelectAccountComponent {
  private store = inject(Store);

  itemButtonClick = new EventEmitter<Account>();
  addButtonClick = new EventEmitter();

  busy$ = this.store
    .select(CORE_STATE.selectAuthenticationStatus)
    .pipe(map((s) => s.type === 'pending'));

  accounts = computed(() =>
    this.store
      .selectSignal(ACCOUNT_STATE.selectAccounts)()
      .all()
      .sort((a, b) => b.authorizedAt.getTime() - a.authorizedAt.getTime()),
  );

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
    this.addButtonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([, busy]) => !busy),
        tap(() => this.store.dispatch(CORE_ACTIONS.authenticate({}))),
      )
      .subscribe();
  }
}
