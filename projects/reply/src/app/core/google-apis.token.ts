/// <reference types="gapi" />
/// <reference types="gapi.client.gmail-v1" />
/// <reference types="google.accounts" />

import { inject, InjectionToken } from '@angular/core';
import { combineLatest, concatMap, map, Observable, shareReplay } from 'rxjs';

import { ScriptLoader } from './script-loader.service';

export interface GoogleApis {
  gmail: typeof gapi.client.gmail;
  identity: typeof google.accounts.id;
  oauth2: typeof google.accounts.oauth2;
}

export const GOOGLE_APIS = new InjectionToken<Observable<GoogleApis>>(
  'GOOGLE_APIS',
  {
    providedIn: 'root',
    factory: () => {
      const scriptLoader = inject(ScriptLoader);
      return combineLatest([
        scriptLoader.load('https://apis.google.com/js/api.js').pipe(
          concatMap(
            () => new Promise((resolve) => gapi.load('client', resolve)),
          ),
          concatMap(() =>
            gapi.client.init({
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
              ],
            }),
          ),
        ),
        scriptLoader.load('https://accounts.google.com/gsi/client'),
      ]).pipe(
        map(() => ({
          gmail: gapi.client.gmail,
          identity: google.accounts.id,
          oauth2: google.accounts.oauth2,
        })),
        shareReplay(1),
      );
    },
  },
);
