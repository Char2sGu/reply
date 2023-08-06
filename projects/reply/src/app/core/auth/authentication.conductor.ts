import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import {
  AuthenticationBackend,
  AuthorizationRequestCancelledException,
} from './authentication.backend';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthenticationConductor {
  private backend = inject(AuthenticationBackend);
  private authService = inject(AuthorizationService);

  requestAuthorization(hint?: string): Observable<boolean> {
    return this.backend.requestAuthorization(hint).pipe(
      map((auth) => this.authService.setAuthorization(auth)),
      catchError((err) => {
        if (err instanceof AuthorizationRequestCancelledException)
          return of(false);
        throw err;
      }),
    );
  }

  revokeAuthorization(): Observable<void> {
    return this.authService.authorization$.pipe(
      switchMap((auth) => {
        if (!auth) return of(undefined);
        return this.backend.revokeAuthorization(auth);
      }),
      tap(() => this.authService.setAuthorization(null)),
    );
  }
}
