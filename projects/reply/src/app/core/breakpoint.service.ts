import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private observer = inject(BreakpointObserver);

  #config$ = new BehaviorSubject<BreakpointConfig | null>(null);
  readonly config$ = this.#config$.pipe();

  readonly breakpoints$ = this.#config$.pipe(
    filter(Boolean),
    switchMap((config) => this.observe(config)),
    shareReplay(1),
  );

  applyConfig(config: BreakpointConfig): void {
    this.#config$.next(config);
  }

  private observe(config: BreakpointConfig): Observable<BreakpointMap> {
    return this.observer
      .observe(Object.values(config))
      .pipe(map((state) => this.parseState(config, state)));
  }

  private parseState(
    config: BreakpointConfig,
    state: BreakpointState,
  ): BreakpointMap {
    const map: Partial<Record<BreakpointName, boolean>> = {};
    for (const k in config) {
      const className = k as BreakpointName;
      const query = config[className];
      map[className] = state.breakpoints[query];
    }
    return map as Required<typeof map>;
  }
}

export type BreakpointName =
  | 'tablet-portrait'
  | 'tablet-landscape'
  | 'laptop'
  | 'desktop';
export type BreakpointConfig = Record<BreakpointName, string>;
export type BreakpointMap = Record<BreakpointName, boolean>;
