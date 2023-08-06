import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { AuthenticationConductor } from '@/app/core/auth/authentication.conductor';
import { AuthenticationService } from '@/app/core/auth/authentication.service';
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
  private authService = inject(AuthenticationService);
  private authConductor = inject(AuthenticationConductor);

  itemButtonClick = new EventEmitter<Account>();
  addButtonClick = new EventEmitter();
  requestAuthorization = new EventEmitter<string | undefined>();
  requestAuthorizationResult = new EventEmitter<boolean>();

  busy$ = this.authService.authorized$.pipe(
    switchMap((authorized) => {
      if (authorized) return of(true); // route resolving
      return merge(
        this.requestAuthorization.pipe(map(() => true)),
        this.requestAuthorizationResult.pipe(map(() => false)),
      );
    }),
    startWith(false),
    shareReplay(1),
  );

  accounts = toSignal(this.queryAccountsAndSort(), { requireSync: true });

  constructor() {
    this.itemButtonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([, busy]) => !busy),
        tap(([account]) => this.requestAuthorization.emit(account.id)),
      )
      .subscribe();
    this.addButtonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([, busy]) => !busy),
        tap(() => this.requestAuthorization.emit(undefined)),
      )
      .subscribe();
    this.requestAuthorization
      .pipe(
        switchMap((hint) => this.authConductor.requestAuthorization(hint)),
        tap((result) => this.requestAuthorizationResult.emit(result)),
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
