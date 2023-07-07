import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  bufferCount,
  filter,
  first,
  map,
  merge,
  of,
  shareReplay,
  startWith,
  timer,
} from 'rxjs';

import { injectAnimationIdFactory } from './core/animations';
import { AuthenticationService } from './core/authentication.service';
import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';
import { INITIALIZER } from './core/initialization';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routes', [
      transition('auth => main', [
        group([
          query(':leave [data-route-animation-target]', [
            animate(`100ms ${AnimationCurves.STANDARD_CURVE}`),
            style({ opacity: 0 }),
          ]),
          query(
            ':enter rpl-side-nav:not(.expanded)',
            [
              style({ transform: 'translateX(-100%)' }),
              animate(`225ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav > .content, :enter rpl-bottom-nav > .background',
            [
              style({ transform: 'translateY(100%)' }),
              animate(`225ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav @*', //
            [animateChild()],
            { optional: true },
          ),
          query(':enter rpl-mail-list-layout', [animateChild()]),
          query(':enter rpl-mail-list-layout rpl-mail-card-list', [
            query(':self', [
              style({ transform: 'scale(92%)' }),
              animate(
                `225ms ${AnimationCurves.DECELERATION_CURVE}`,
                style({ transform: 'scale(1)' }),
              ),
            ]),
          ]),
        ]),
      ]),
    ]),
    trigger('launchScreen', [
      transition(':leave', [
        animate(`100ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ opacity: 0 }),
      ]),
    ]),
  ],
  host: {
    ['[@routes]']: 'animationId()',
  },
})
export class AppComponent {
  animationId = injectAnimationIdFactory();
  private breakpoints = inject(BREAKPOINTS);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private initializers = [
    ...inject(INITIALIZER),
    () =>
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        first(),
      ),
    () => timer(500),
  ];

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  initialized$ = merge(...this.initializers.map((i) => i() ?? of(null))).pipe(
    bufferCount(this.initializers.length),
    map(() => true),
    startWith(false),
    shareReplay(1),
  );

  constructor() {
    this.authService.authorized$.subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
