import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  InteropObservable,
  startWith,
  Subscribable,
} from 'rxjs';

import { LOCAL_STORAGE } from './native-api.tokens';

@Injectable()
export abstract class PersistentValueAccessor<T>
  implements InteropObservable<T | null>
{
  protected storage = inject(LOCAL_STORAGE);
  protected value$ = new BehaviorSubject<T | null | undefined>(undefined);
  abstract readonly key: string;

  set(value: T): void {
    this.storage.setItem(this.key, JSON.stringify(value));
    this.value$.next(value);
  }

  get(): T | null {
    if (this.value$.value !== undefined) return this.value$.value;
    const raw = this.storage.getItem(this.key);
    const value = raw ? JSON.parse(raw) : null;
    this.value$.next(value);
    return value;
  }

  clear(): void {
    this.storage.removeItem(this.key);
    this.value$.next(null);
  }

  [Symbol.observable] = (): Subscribable<T | null> =>
    this.value$.pipe(
      filter((v): v is Exclude<typeof v, undefined> => v !== undefined),
      startWith(this.get()),
    );
}
