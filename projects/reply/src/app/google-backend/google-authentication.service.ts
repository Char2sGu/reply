import { inject, Injectable, NgZone } from '@angular/core';
import dayjs from 'dayjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  first,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  throwIfEmpty,
  timer,
} from 'rxjs';

import {
  AuthenticationService,
  Authorization,
} from '../core/authentication.service';
import {
  InvalidResponseException,
  UnauthorizedException,
} from '../core/exceptions';
import { Contact } from '../data/contact.model';
import { ContactRepository } from '../data/contact.repository';
import { GOOGLE_APIS } from './core/google-apis.token';
import { useGoogleApi } from './core/google-apis.utils';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
] as const;

@Injectable()
export class GoogleAuthenticationService implements AuthenticationService {
  private contactRepo = inject(ContactRepository);
  private apis$ = inject(GOOGLE_APIS);
  private clientId = inject(GOOGLE_CLIENT_ID);

  private peopleGetApi = useGoogleApi((a) => a.people.people.get);
  private tokenRevokeApi = useGoogleApi(
    (a) => (arg: Parameters<typeof a.oauth2.revoke>[0]) =>
      new Promise<void>((r) => a.oauth2.revoke(arg, r)),
  );

  private tokenClient$ = this.apis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: this.clientId,
        scope: SCOPES.join(' '),
        callback: (response) => {
          NgZone.assertInAngularZone();
          this.setAuthorization({
            token: response['access_token'],
            issuedAt: new Date(),
            lifespan: +response['expires_in'],
          });
        },
      }),
    ),
  );

  private authorizationUpdate$ = new Subject<
    | {
        type: 'obtain';
        value: Authorization;
      }
    | { type: 'expire' }
    | { type: 'revoke' }
  >();

  readonly authorization$: Observable<Authorization | null> =
    this.authorizationUpdate$.pipe(
      map((update): Authorization | null =>
        update.type === 'obtain' ? update.value : null,
      ),
      startWith(null),
      shareReplay(1),
    );

  readonly authorized$: Observable<boolean> = this.authorization$.pipe(
    map((auth) => !!auth),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly user$: Observable<Contact> = this.authorized$.pipe(
    filter(Boolean),
    switchMap(() =>
      this.peopleGetApi({
        resourceName: 'people/me',
        personFields: 'photos,emailAddresses',
      }),
    ),
    map((response): Contact => {
      const { resourceName, photos, emailAddresses } = response.result;
      const photo = photos?.find((p) => p.metadata?.primary);
      const email = emailAddresses?.find((e) => e.metadata?.primary);
      if (!email || !photo) throw new InvalidResponseException();
      return {
        id: resourceName,
        name: email.displayName,
        email: email.value,
        avatarUrl: photo.url,
      };
    }),
    switchMap((c) => this.contactRepo.insertOrPatch(c)),
    shareReplay(1),
  );

  setAuthorization(auth: Authorization): boolean {
    const issueDate = dayjs(auth.issuedAt);
    const expireDate = issueDate.add(auth.lifespan, 'seconds');
    const isAboutToExpire = () => dayjs().add(1, 'minute').isAfter(expireDate);

    if (isAboutToExpire()) return false;

    this.authorizationUpdate$.next({ type: 'obtain', value: auth });
    timer(0, 30 * 1000)
      .pipe(
        takeUntil(this.authorizationUpdate$),
        filter(() => isAboutToExpire()),
      )
      .subscribe(() => {
        this.authorizationUpdate$.next({ type: 'expire' });
      });
    return true;
  }

  requestAuthorization(): void {
    this.tokenClient$.pipe(first()).subscribe((client) => {
      client.requestAccessToken();
    });
  }

  revokeAuthorization(): void {
    this.authorization$
      .pipe(
        first(),
        filter(Boolean),
        throwIfEmpty(() => new UnauthorizedException()),
        concatMap((auth) => this.tokenRevokeApi(auth.token)),
      )
      .subscribe(() => {
        this.authorizationUpdate$.next({ type: 'revoke' });
      });
  }
}
