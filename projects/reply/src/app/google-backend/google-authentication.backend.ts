import { inject, Injectable } from '@angular/core';
import {
  first,
  map,
  Observable,
  race,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { AuthenticationBackend } from '../core/auth/authentication.backend';
import { Authorization } from '../core/auth/authorization.model';
import { GOOGLE_APIS } from './core/google-apis.object';
import { useGoogleApi } from './core/google-apis.utils';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/directory.readonly',
] as const;

@Injectable()
export class GoogleAuthenticationBackend implements AuthenticationBackend {
  private apis$ = inject(GOOGLE_APIS);
  private clientId = inject(GOOGLE_CLIENT_ID);

  private tokenRevokeApi = useGoogleApi(
    (a) => (arg: Parameters<typeof a.oauth2.revoke>[0]) =>
      new Promise<void>((r) => a.oauth2.revoke(arg, r)),
  );

  private tokenClient$ = this.apis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: this.clientId,
        ['scope']: SCOPES.join(' '),
        ['callback']: (response) => this.tokenClientResponse$.next(response),
        ['error_callback']: (error) => this.tokenClientError$.next(error),
      }),
    ),
    shareReplay(1),
  );
  private tokenClientResponse$ =
    new Subject<google.accounts.oauth2.TokenResponse>();
  private tokenClientError$ =
    new Subject<google.accounts.oauth2.ClientConfigError>();

  requestAuthorization(hint?: string): Observable<Authorization> {
    return this.tokenClient$.pipe(
      tap((client) => client.requestAccessToken({ hint })),
      switchMap(() =>
        race(
          this.tokenClientResponse$.pipe(
            map((resp) => ({
              token: resp['access_token'],
              issuedAt: new Date(),
              lifespan: +resp['expires_in'],
            })),
          ),
          this.tokenClientError$.pipe(
            switchMap((err) => throwError(() => err)),
          ),
        ).pipe(first()),
      ),
    );
  }

  revokeAuthorization(auth: Authorization): Observable<void> {
    return this.tokenRevokeApi(auth.token);
  }
}
