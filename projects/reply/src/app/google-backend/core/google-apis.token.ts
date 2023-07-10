/// <reference types="gapi" />
/// <reference types="gapi.client.gmail-v1" />
/// <reference types="gapi.people" />
/// <reference types="google.accounts" />

import { inject, InjectionToken, NgZone } from '@angular/core';
import {
  combineLatest,
  concatMap,
  map,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';

import { includeThenableInZone } from '@/app/core/zone.utils';

import { ScriptLoader } from '../../core/script-loader.service';

export interface GoogleApis {
  gmail: typeof gapi.client.gmail;
  people: typeof gapi.client.people;
  oauth2: typeof google.accounts.oauth2;
}

export const GOOGLE_APIS = new InjectionToken<Observable<GoogleApis>>(
  'GOOGLE_APIS',
  {
    providedIn: 'root',
    factory: () => {
      const scriptLoader = inject(ScriptLoader);
      const zone = inject(NgZone);
      return combineLatest([
        scriptLoader.load('https://apis.google.com/js/api.js').pipe(
          concatMap(() => {
            const promise = new Promise<void>((r) => gapi.load('client', r));
            return includeThenableInZone(zone, promise);
          }),
          concatMap(() => {
            const promise = gapi.client.init({
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
              ],
            });
            return includeThenableInZone(zone, promise);
          }),
        ),
        scriptLoader.load('https://accounts.google.com/gsi/client'),
      ]).pipe(
        tap(() => NgZone.assertInAngularZone()),
        map(() => ({
          gmail: gapi.client.gmail,
          people: gapi.client.people,
          oauth2: google.accounts.oauth2,
        })),
        shareReplay(1),
      );
    },
  },
);
