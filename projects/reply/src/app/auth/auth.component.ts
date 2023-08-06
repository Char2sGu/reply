import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { filter, first, map, switchMap } from 'rxjs';

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

  constructor() {
    this.buttonClick
      .pipe(switchMap(() => this.authConductor.requestAuthorization()))
      .subscribe();

    this.accountRepo
      .query()
      .pipe(
        map((accounts) => this.findLatestAuthorizedAccount(accounts)),
        first(),
        filter(Boolean),
        switchMap((a) => this.authConductor.requestAuthorization(a.id)),
      )
      .subscribe();
  }

  private findLatestAuthorizedAccount(accounts: Account[]): Account | null {
    return (
      accounts
        .sort((a, b) => a.authorizedAt.getTime() - b.authorizedAt.getTime())
        .at(-1) ?? null
    );
  }
}
