import { NgZone } from '@angular/core';

export function includePromiseInZone<T>(
  zone: NgZone,
  promise: Promise<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise.then(
      (v) => zone.run(() => resolve(v)),
      (e) => zone.run(() => reject(e)),
    );
  });
}
