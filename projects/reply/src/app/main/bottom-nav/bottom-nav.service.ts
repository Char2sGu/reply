import { inject, Injectable, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomNavService {
  private router = inject(Router);

  #actions$ = new BehaviorSubject<TemplateRef<never> | null>(null);
  readonly actions$ = this.#actions$.pipe();

  #status$ = new BehaviorSubject<BottomNavStatus>('expanded');
  readonly status$: Observable<BottomNavStatus> = merge(
    this.#status$,
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => 'expanded' as const),
    ),
  ).pipe(
    startWith('expanded' as const),
    distinctUntilChanged(),
    shareReplay(1),
  );

  useActions(actions: TemplateRef<never> | null): void {
    this.#actions$.next(actions);
  }

  setStatus(status: BottomNavStatus): void {
    this.#status$.next(status);
  }
}

export type BottomNavStatus = 'collapsed' | 'expanded';
