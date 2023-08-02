import { inject, NgZone } from '@angular/core';
import { concatMap, map, Observable } from 'rxjs';

import { includeThenableInZone } from '@/app/core/zone.utils';

import { GOOGLE_APIS, GoogleApis } from './google-apis.object';

type GoogleApi = (...args: any[]) => PromiseLike<any>;

type WrapGoogleApi<API extends GoogleApi> = (
  ...args: Parameters<API>
) => ReturnType<API> extends PromiseLike<infer R> ? Observable<R> : never;

export function useGoogleApi<API extends GoogleApi>(
  factory: (apis: GoogleApis) => API,
): WrapGoogleApi<API> {
  const apis$ = inject(GOOGLE_APIS);
  const zone = inject(NgZone);
  const api$ = apis$.pipe(map((apis) => factory(apis)));
  const wrapped = (...args: Parameters<API>) =>
    api$.pipe(
      concatMap((api) => {
        const promise = api(...args);
        return includeThenableInZone(zone, promise);
      }),
    );
  return wrapped as any;
}
