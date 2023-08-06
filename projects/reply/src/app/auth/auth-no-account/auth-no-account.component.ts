import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { map, merge, of, shareReplay, startWith, switchMap, tap } from 'rxjs';

import { AuthenticationConductor } from '@/app/core/auth/authentication.conductor';
import { AuthenticationService } from '@/app/core/auth/authentication.service';

@Component({
  selector: 'rpl-auth-no-account',
  templateUrl: './auth-no-account.component.html',
  styleUrls: ['./auth-no-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthNoAccountComponent {
  private authService = inject(AuthenticationService);
  private authConductor = inject(AuthenticationConductor);

  buttonClick = new EventEmitter();
  requestAuthorization = new EventEmitter();
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

  constructor() {
    this.buttonClick
      .pipe(tap(() => this.requestAuthorization.emit()))
      .subscribe();
    this.requestAuthorization
      .pipe(
        switchMap(() => this.authConductor.requestAuthorization()),
        tap((result) => this.requestAuthorizationResult.emit(result)),
      )
      .subscribe();
  }
}
