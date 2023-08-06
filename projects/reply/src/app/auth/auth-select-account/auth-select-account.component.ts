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

import { useActionFlow } from '@/app/core/action-flow';
import { SessionService } from '@/app/core/session.service';
import { Account } from '@/app/data/account/account.model';
import { AccountRepository } from '@/app/data/account/account.repository';

import { AuthenticateActionFlow } from '../core/auth.action-flows';

@Component({
  selector: 'rpl-auth-select-account',
  templateUrl: './auth-select-account.component.html',
  styleUrls: ['./auth-select-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSelectAccountComponent {
  private sessionService = inject(SessionService);
  private accountRepo = inject(AccountRepository);

  private authenticate = useActionFlow(AuthenticateActionFlow);

  itemButtonClick = new EventEmitter<Account>();
  addButtonClick = new EventEmitter();
  authenticateStart = new EventEmitter<string | undefined>();
  authenticateComplete = new EventEmitter<boolean>();

  busy$ = this.sessionService.authorized$.pipe(
    switchMap((authorized) => {
      if (authorized) return of(true); // route resolving
      return merge(
        this.authenticateStart.pipe(map(() => true)),
        this.authenticateComplete.pipe(map(() => false)),
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
        tap(([account]) => this.authenticateStart.emit(account.id)),
      )
      .subscribe();
    this.addButtonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([, busy]) => !busy),
        tap(() => this.authenticateStart.emit(undefined)),
      )
      .subscribe();
    this.authenticateStart
      .pipe(
        switchMap((hint) => this.authenticate({ hint })),
        tap((result) => this.authenticateComplete.emit(result)),
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
