import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointManager {
  readonly breakpoints$: Observable<BreakpointMap>;

  private config: BreakpointConfig;

  constructor(private observer: BreakpointObserver) {
    this.config = {
      ['tablet-portrait']: '(min-width: 600px)',
      ['tablet-landscape']: '(min-width: 905px)',
      ['laptop']: '(min-width: 1240px)',
      ['desktop']: '(min-width: 1440px)',
    };
    this.breakpoints$ = this.observer.observe(Object.values(this.config)).pipe(
      map((state) => this.parseState(state)),
      shareReplay(1),
    );
  }

  private parseState(state: BreakpointState): BreakpointMap {
    const map: Partial<Record<BreakpointName, boolean>> = {};
    for (const k in this.config) {
      const className = k as BreakpointName;
      const query = this.config[className];
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
