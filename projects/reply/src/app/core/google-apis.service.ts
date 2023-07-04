/// <reference types="gapi" />
/// <reference types="gapi.client.gmail-v1" />

import { inject } from '@angular/core';

import { ScriptLoader } from './script-loader.service';

export class GoogleApis implements PromiseLike<typeof gapi> {
  private scriptLoader = inject(ScriptLoader);

  private promise = this.load().then(() => gapi);

  then<TResult1 = typeof gapi, TResult2 = never>(
    onfulfilled?:
      | ((value: typeof gapi) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  private async load(): Promise<void> {
    await this.scriptLoader.load('https://apis.google.com/js/api.js');
    await new Promise((resolve, reject) =>
      gapi.load('client', { callback: resolve, onerror: reject }),
    );
    await gapi.client.init({
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
      ],
    });
  }
}
