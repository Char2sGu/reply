import { EventEmitter, inject, Injectable, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
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

  private actionsChange = new EventEmitter<TemplateRef<never> | null>();
  actions$ = this.actionsChange.pipe(shareReplay(1), startWith(null));

  private statusChange = new EventEmitter<BottomNavStatus>();
  status$: Observable<BottomNavStatus> = merge(
    this.statusChange,
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
    this.actionsChange.emit(actions);
  }

  setStatus(status: BottomNavStatus): void {
    this.statusChange.emit(status);
  }
}

export type BottomNavStatus = 'collapsed' | 'expanded';
