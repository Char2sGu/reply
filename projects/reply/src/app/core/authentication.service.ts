import { inject, Injectable, NgZone } from '@angular/core';
import dayjs from 'dayjs/esm';
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
  takeUntil,
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

  private tokenClient$ = this.googleApis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: environment.googleClientId,
        scope: SCOPES.join(' '),
        callback: (response) => {
          this.zone.run(() =>
            this.setAuthorization({
              token: response['access_token'],
              issuedAt: new Date(),
              expiresIn: +response['expires_in'],
            }),
          );
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
    const expireDate = issueDate.add(auth.expiresIn, 'seconds');
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
    combineLatest([this.googleApis$, this.authorization$])
      .pipe(first())
      .subscribe(([apis, auth]) => {
        if (!auth) throw new UnauthorizedException();
        apis.oauth2.revoke(auth.token, () => {
          this.authorizationUpdate$.next({ type: 'revoke' });
        });
      });
  }
}

export interface Authorization {
  token: string;
  issuedAt: Date;
  expiresIn: number;
}
