/// <reference types="google.accounts" />

import { inject, Injectable } from '@angular/core';

import { ScriptLoader } from './script-loader.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAccountsApi implements PromiseLike<typeof google.accounts> {
  private scriptLoader = inject(ScriptLoader);

  private promise = this.load().then(() => google.accounts);

  then<TResult1 = typeof google.accounts, TResult2 = never>(
    onfulfilled?:
      | ((value: typeof google.accounts) => TResult1 | PromiseLike<TResult1>)
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
    await this.scriptLoader.load('https://accounts.google.com/gsi/client');
  }
}
