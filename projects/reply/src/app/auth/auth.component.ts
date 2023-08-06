import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { filter, first, map, Observable, switchMap } from 'rxjs';

import { AuthenticationConductor } from '../core/auth/authentication.conductor';
import { AuthenticationService } from '../core/auth/authentication.service';
import { Account } from '../data/account/account.model';
import { AccountRepository } from '../data/account/account.repository';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);
  private authConductor = inject(AuthenticationConductor);
  private accountRepo = inject(AccountRepository);

  buttonClick = new EventEmitter();

  checked = false;
  loading$ = this.authService.authorized$;

  private lastAccount$ = this.queryLastAccount();

  constructor() {
    this.buttonClick
      .pipe(switchMap(() => this.authConductor.requestAuthorization()))
      .subscribe();
    this.lastAccount$
      .pipe(
        filter(Boolean),
        first(),
        switchMap((a) => this.authConductor.requestAuthorization(a.id)),
      )
      .subscribe();
  }

  private queryLastAccount(): Observable<Account | undefined> {
    return this.accountRepo.query().pipe(
      first(),
      map((accounts) =>
        accounts
          .sort((a, b) => a.authorizedAt.getTime() - b.authorizedAt.getTime())
          .at(-1),
      ),
    );
  }
}
