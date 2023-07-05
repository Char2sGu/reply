import { inject, Injectable, NgZone } from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  first,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { environment } from '@/environments/environment';

import { Contact } from '../data/contact.model';
import { ContactRepository } from '../data/contact.repository';
import { ResponseNotValidException } from './exceptions';
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

  private tokenResponse$ = new Subject<google.accounts.oauth2.TokenResponse>();
  private tokenClient$ = this.googleApis$.pipe(
    map((apis) =>
      apis.oauth2.initTokenClient({
        ['client_id']: environment.googleClientId,
        scope: SCOPES.join(' '),
        callback: (r) => {
          this.zone.run(() => this.tokenResponse$.next(r));
        },
      }),
    ),
  );

  readonly authorized$: Observable<boolean> = this.tokenResponse$.pipe(
    map(() => true),
    startWith(false),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly user$: Observable<Contact> = combineLatest([
    this.googleApis$,
    this.tokenResponse$,
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
      if (!email || !photo) throw new ResponseNotValidException();
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

  requestAuthorization(): void {
    this.tokenClient$.pipe(first()).subscribe((client) => {
      client.requestAccessToken();
    });
  }
}
