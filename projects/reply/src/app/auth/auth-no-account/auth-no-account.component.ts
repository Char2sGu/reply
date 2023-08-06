import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { map, merge, of, shareReplay, startWith, switchMap, tap } from 'rxjs';

import { useActionFlow } from '@/app/core/action-flow';
import { SessionService } from '@/app/core/session.service';

import { AuthenticateActionFlow } from '../core/auth.action-flows';

@Component({
  selector: 'rpl-auth-no-account',
  templateUrl: './auth-no-account.component.html',
  styleUrls: ['./auth-no-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthNoAccountComponent {
  private sessionService = inject(SessionService);

  private authenticate = useActionFlow(AuthenticateActionFlow);

  buttonClick = new EventEmitter();
  authenticateStart = new EventEmitter();
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

  constructor() {
    this.buttonClick.pipe(tap(() => this.authenticateStart.emit())).subscribe();
    this.authenticateStart
      .pipe(
        switchMap(() => this.authenticate()),
        tap((result) => this.authenticateComplete.emit(result)),
      )
      .subscribe();
  }
}
