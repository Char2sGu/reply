import { inject, InjectionToken } from '@angular/core';
import { combineLatest, filter, map, Observable, shareReplay } from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';

import { GOOGLE_APIS, GoogleApis } from './google-apis.token';

export const AUTHORIZED_GOOGLE_APIS = new InjectionToken<
  Observable<GoogleApis>
>('AUTHORIZED_GOOGLE_APIS', {
  providedIn: 'root',
  factory: () =>
    combineLatest([
      inject(GOOGLE_APIS),
      inject(AuthenticationService).authorized$,
    ]).pipe(
      filter(([, authorized]) => authorized),
      map(([apis]) => apis),
      shareReplay(1),
    ),
});
