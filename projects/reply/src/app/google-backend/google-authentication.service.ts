import { EventEmitter, inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import {
  concatMap,
  filter,
  first,
  map,
  Observable,
  race,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwIfEmpty,
  timer,
} from 'rxjs';

import {
  AuthenticationService,
  Authorization,
} from '../core/auth/authentication.service';
import { UnauthorizedException } from '../core/exceptions';
import { Contact } from '../data/contact/contact.model';
import { ContactService } from '../data/contact/contact.service';
import { GOOGLE_APIS } from './core/google-apis.token';
import { useGoogleApi } from './core/google-apis.utils';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/contacts.readonly',
] as const;

@Injectable()
export class GoogleAuthenticationService implements AuthenticationService {
  private contactService = inject(ContactService);
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

  private authorizationUpdate = new EventEmitter<
    | {
        type: 'obtain';
        value: Authorization;
      }
    | { type: 'expire' }
    | { type: 'revoke' }
  >();

  readonly authorization$: Observable<Authorization | null> =
    this.authorizationUpdate.pipe(
      map((update): Authorization | null =>
        update.type === 'obtain' ? update.value : null,
      ),
      startWith(null),
      shareReplay(1),
    );

  readonly user$: Observable<Contact> = this.authorization$.pipe(
    filter(Boolean),
    switchMap(() => this.contactService.loadUser()),
    shareReplay(1),
  );

  setAuthorization(auth: Authorization): boolean {
    const issueDate = dayjs(auth.issuedAt);
    const expireDate = issueDate.add(auth.lifespan, 'seconds');
    const isAboutToExpire = () => dayjs().add(1, 'minute').isAfter(expireDate);

    if (isAboutToExpire()) return false;

    this.authorizationUpdate.emit({ type: 'obtain', value: auth });
    timer(0, 30 * 1000)
      .pipe(
        takeUntil(this.authorizationUpdate),
        filter(() => isAboutToExpire()),
      )
      .subscribe(() => {
        this.authorizationUpdate.emit({ type: 'expire' });
      });
    return true;
  }

  requestAuthorization(hint?: string): Observable<boolean> {
    return this.tokenClient$.pipe(
      tap((client) => client.requestAccessToken({ hint })),
      switchMap(() =>
        race(
          this.tokenClientResponse$.pipe(
            tap((resp) =>
              this.setAuthorization({
                token: resp['access_token'],
                issuedAt: new Date(),
                lifespan: +resp['expires_in'],
              }),
            ),
            map(() => true),
          ),
          this.tokenClientError$.pipe(map(() => false)),
        ).pipe(first()),
      ),
    );
  }

  revokeAuthorization(): Observable<void> {
    return this.authorization$.pipe(
      first(),
      filter(Boolean),
      throwIfEmpty(() => new UnauthorizedException()),
      concatMap((auth) => this.tokenRevokeApi(auth.token)),
      tap(() => this.authorizationUpdate.emit({ type: 'revoke' })),
    );
  }
}
