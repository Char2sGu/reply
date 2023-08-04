import { inject, NgZone } from '@angular/core';
import { catchError, concatMap, map, Observable, throwError } from 'rxjs';

import { Exception } from '@/app/core/exceptions';
import { includeThenableInZone } from '@/app/core/zone.utils';

import { GOOGLE_APIS, GoogleApis } from './google-apis.object';

type GoogleApi = (...args: any[]) => gapi.client.Request<any>;

type WrapGoogleApi<API extends GoogleApi> = (
  ...args: Parameters<API>
) => ReturnType<API> extends gapi.client.Request<infer R>
  ? Observable<R>
  : never;

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
        return includeThenableInZone(zone, promise).then((r) => r.result);
      }),
      catchError((response: gapi.client.Response<any>) => {
        const err = () => new GoogleAPiErrorResponseException(response);
        return throwError(err);
      }),
    );
  return wrapped as any;
}

export class GoogleApiException extends Exception {}
export class GoogleAPiErrorResponseException extends GoogleApiException {
  constructor(readonly response: gapi.client.Response<any>) {
    const { status, result } = response;
    super(`[${status}]\n${JSON.stringify(result, null, 2)}`);
  }

  isBadRequest(): boolean {
    return this.response.status === 400;
  }
  isUnauthorized(): boolean {
    return this.response.status === 401;
  }
  isPermissionDenied(): boolean {
    return this.response.status === 403;
  }
  isNotFound(): boolean {
    return this.response.status === 404;
  }
  isQuotaExceeded(): boolean {
    return this.response.status === 429;
  }
}
