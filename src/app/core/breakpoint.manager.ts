import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointManager {
  readonly breakpoints$: Observable<BreakpointMap>;

  private config: BreakpointConfig;

  constructor(private observer: BreakpointObserver) {
    this.config = {
      sm: '(min-width: 600px)',
      md: '(min-width: 905px)',
      lg: '(min-width: 1240px)',
      xl: '(min-width: 1440px)',
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

export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl';
export type BreakpointConfig = Record<BreakpointName, string>;
export type BreakpointMap = Record<BreakpointName, boolean>;
