import { EventEmitter, inject, Injectable, NgZone } from '@angular/core';
import {
  first,
  map,
  Observable,
  race,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { AuthenticationService } from '../../../app/core/auth/authentication.service';
import { Authorization } from '../../../app/core/auth/authorization.model';
import { includeThenableInZone } from '../../../app/core/zone.utils';
import { GOOGLE_APIS } from '../core/google-apis.object';
import { GOOGLE_CLIENT_ID } from '../core/google-client-id.token';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/directory.readonly',
] as const;

@Injectable()
export class GoogleAuthenticationService implements AuthenticationService {
  private zone = inject(NgZone);
  private apis$ = inject(GOOGLE_APIS);
  private clientId = inject(GOOGLE_CLIENT_ID);

  private tokenClient$ = this.apis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: this.clientId,
        ['scope']: SCOPES.join(' '),
        ['prompt']: '',
        ['callback']: (response) => this.tokenClientRespond.next(response),
        ['error_callback']: (error) => this.tokenClientError.next(error),
      }),
    ),
    shareReplay(1),
  );

  private tokenClientRespond =
    new EventEmitter<google.accounts.oauth2.TokenResponse>();
  private tokenClientError =
    new EventEmitter<google.accounts.oauth2.ClientConfigError>();

  requestAuthorization(hint?: string): Observable<Authorization | null> {
    return this.tokenClient$.pipe(
      tap((client) => client.requestAccessToken({ hint })),
      switchMap(() =>
        race(
          this.tokenClientRespond.pipe(
            map((resp) => ({
              token: resp['access_token'],
              issuedAt: new Date(),
              lifespan: +resp['expires_in'],
            })),
          ),
          this.tokenClientError.pipe(map(() => null)),
        ).pipe(first()),
      ),
    );
  }

  revokeAuthorization(auth: Authorization): Observable<void> {
    return this.apis$.pipe(
      map((apis) => apis.oauth2.revoke),
      map((revoke) => new Promise<void>((r) => revoke(auth.token, r))),
      switchMap((promise) => includeThenableInZone(this.zone, promise)),
    );
  }
}
