/// <reference types="gapi" />
/// <reference types="gapi.client.gmail-v1" />
/// <reference types="gapi.people" />
/// <reference types="google.accounts" />

import { ApplicationRef, inject, InjectionToken } from '@angular/core';
import {
  combineLatest,
  concatMap,
  map,
  Observable,
  shareReplay,
  tap,
  timer,
} from 'rxjs';

import { ScriptLoader } from './script-loader.service';

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
      const applicationRef = inject(ApplicationRef);
      return combineLatest([
        scriptLoader.load('https://apis.google.com/js/api.js').pipe(
          concatMap(
            () => new Promise((resolve) => gapi.load('client', resolve)),
          ),
          concatMap(() =>
            gapi.client.init({
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
              ],
            }),
          ),
        ),
        scriptLoader.load('https://accounts.google.com/gsi/client'),
      ]).pipe(
        map(() => ({
          gmail: gapi.client.gmail,
          people: gapi.client.people,
          oauth2: google.accounts.oauth2,
        })),
        tap(() => timer(0).subscribe(() => applicationRef.tick())),
        shareReplay(1),
      );
    },
  },
);
