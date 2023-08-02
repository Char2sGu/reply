import { EventEmitter, inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';

import { AuthenticationBackend } from './authentication.backend';
import { Authorization } from './authorization.model';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthenticationService {
  private backend = inject(AuthenticationBackend);

  private authorizationChange = new EventEmitter<Authorization | null>();

  readonly authorization$ = this.authorizationChange
    .asObservable()
    .pipe(startWith(null), shareReplay(1));

  requestAuthorization(hint?: string): Observable<boolean> {
    return this.backend.requestAuthorization(hint).pipe(
      map((auth) => this.setAuthorization(auth)),
      catchError(() => of(false)),
    );
  }

  revokeAuthorization(): Observable<void> {
    return this.authorization$.pipe(
      switchMap((auth) =>
        auth ? this.backend.revokeAuthorization(auth) : of(undefined),
      ),
    );
  }

  setAuthorization(auth: Authorization): boolean {
    const issueDate = dayjs(auth.issuedAt);
    const expireDate = issueDate.add(auth.lifespan, 'seconds');

    const isAboutToExpire = () => dayjs().add(1, 'minute').isAfter(expireDate);

    if (isAboutToExpire()) return false;

    this.authorizationChange.emit(auth);
    timer(0, 30 * 1000)
      .pipe(
        takeUntil(this.authorizationChange),
        filter(() => isAboutToExpire()),
      )
      .subscribe(() => {
        this.authorizationChange.emit(null);
      });
    return true;
  }
}
