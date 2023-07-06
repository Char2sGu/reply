import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { environment } from '@/environments/environment';

import { Contact } from '../data/contact.model';
import { ContactRepository } from '../data/contact.repository';
import { InvalidResponseException, UnauthorizedException } from './exceptions';
import { GOOGLE_APIS } from './google-apis.token';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
] as const;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private contactRepo = inject(ContactRepository);
  private googleApis$ = inject(GOOGLE_APIS);
  private zone = inject(NgZone);
  private applicationRef = inject(ApplicationRef);

  private tokenUpdate$ = new Subject<
    | {
        type: 'obtain';
        response: google.accounts.oauth2.TokenResponse;
      }
    | { type: 'revoke' }
  >();

  private tokenClient$ = this.googleApis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: environment.googleClientId,
        scope: SCOPES.join(' '),
        callback: (response) => {
          this.zone.run(() =>
            this.tokenUpdate$.next({ type: 'obtain', response }),
          );
        },
      }),
    ),
  );

  readonly authorization$: Observable<Authorization | null> =
    this.tokenUpdate$.pipe(
      map((update): Authorization | null =>
        update.type === 'obtain'
          ? {
              token: update.response['access_token'],
              issuedAt: new Date(),
              expiresIn: +update.response['expires_in'],
            }
          : null,
      ),
      startWith(null),
      shareReplay(1),
    );

  readonly authorized$: Observable<boolean> = this.authorization$.pipe(
    map((auth) => !!auth),
  );

  readonly user$: Observable<Contact> = combineLatest([
    this.googleApis$,
    this.authorized$.pipe(filter(Boolean)),
  ]).pipe(
    switchMap(([apis]) =>
      apis.people.people.get({
        resourceName: 'people/me',
        personFields: 'photos,emailAddresses',
      }),
    ),
    tap(() => timer(0).subscribe(() => this.applicationRef.tick())),
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

  constructor() {
    /* eslint-disable no-console */
    if (!environment.production)
      this.googleApis$.subscribe(() => {
        if (localStorage['tokenResponse']) {
          const parsed = JSON.parse(localStorage['tokenResponse']);
          this.tokenUpdate$.next(parsed);
          gapi.client.setToken(parsed);
          console.log('token response restored', parsed);
        }
        this.tokenUpdate$.subscribe((r) => {
          localStorage['tokenResponse'] = JSON.stringify(r);
          console.log('token response saved', r);
        });
      });
    /* eslint-enable no-console */
  }

  requestAuthorization(): void {
    this.tokenClient$.pipe(first()).subscribe((client) => {
      client.requestAccessToken();
    });
  }

  revokeAuthorization(): void {
    combineLatest([this.googleApis$, this.authorization$])
      .pipe(first())
      .subscribe(([apis, auth]) => {
        if (!auth) throw new UnauthorizedException();
        apis.oauth2.revoke(auth.token, () => {
          this.tokenUpdate$.next({ type: 'revoke' });
        });
      });
  }
}

export interface Authorization {
  token: string;
  issuedAt: Date;
  expiresIn: number;
}
