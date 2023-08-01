import { EventEmitter } from '@angular/core';
import {
  buffer,
  concatMap,
  debounceTime,
  first,
  map,
  Observable,
  shareReplay,
} from 'rxjs';

import { Exception } from './exceptions';

export abstract class AggregationResolver<P, R> {
  protected readonly resolveRequest = new EventEmitter<P>();
  protected readonly resolveResults$ = this.resolveRequest.pipe(
    buffer(this.resolveRequest.pipe(debounceTime(this.duration))),
    concatMap((payloads) => this.resolveAggregationIntoMap(payloads)),
    shareReplay(1),
  );

  constructor(protected readonly duration = 100) {}

  resolve(payload: P): Observable<R> {
    this.resolveRequest.emit(payload);
    return this.resolveResults$.pipe(
      first(),
      map((results) => {
        const result = results.get(payload);
        if (!result)
          throw new AggregationResolveException('Missing resolve result');
        return result;
      }),
    );
  }

  protected abstract resolveAggregation(payloads: P[]): Observable<R[]>;

  protected resolveAggregationIntoMap(payloads: P[]): Observable<Map<P, R>> {
    return this.resolveAggregation(payloads).pipe(
      map((results) => new Map(results.map((r, i) => [payloads[i], r]))),
    );
  }
}

export class AggregationResolveException extends Exception {}
