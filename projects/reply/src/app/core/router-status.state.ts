import { Injectable } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map, merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterStatus {
  navigating$ = merge(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map(() => true),
    ),
    this.router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationEnd || event instanceof NavigationError,
      ),
      map(() => false),
    ),
  );

  constructor(private router: Router) {}
}
