import { NgZone } from '@angular/core';

export function includeThenableInZone<T>(
  zone: NgZone,
  thenable: PromiseLike<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    thenable.then(
      (v) => zone.run(() => resolve(v)),
      (e) => zone.run(() => reject(e)),
    );
  });
}
