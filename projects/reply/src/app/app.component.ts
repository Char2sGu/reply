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
  pairwise,
  shareReplay,
  startWith,
  timer,
} from 'rxjs';

import { usePrimaryChildRouteAnimationId } from './core/animations';
import { AuthenticationService } from './core/auth/authentication.service';
import { BreakpointMap } from './core/breakpoint.service';
import { useBreakpoints } from './core/breakpoint.utils';
import { APP_PREPARER } from './core/preparation';

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
            animate(`50ms linear`),
            style({ opacity: 0 }),
          ]),
          query(
            ':enter rpl-side-nav:not(.expanded)',
            [
              style({ transform: 'translateX(-100%)' }),
              animate(`225ms 50ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav > .content, :enter rpl-bottom-nav > .background',
            [
              style({ transform: 'translateY(100%)' }),
              animate(`225ms 50ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav @*', //
            [animateChild()],
            { optional: true },
          ),
          query(':enter rpl-mail-list-layout', [
            animateChild({ delay: '50ms' }),
          ]),
        ]),
      ]),
    ]),
    trigger('launchScreen', [
      transition(':leave', [animate(`50ms linear`), style({ opacity: 0 })]),
    ]),
  ],
  host: {
    ['[@routes]']: 'animationId()',
  },
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private preparers = [
    ...inject(APP_PREPARER),
    () =>
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        first(),
      ),
    () => timer(500),
  ];

  animationId = usePrimaryChildRouteAnimationId();
  private breakpoints = useBreakpoints();

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  prepared$ = merge(...this.preparers.map((i) => i() ?? of(null))).pipe(
    bufferCount(this.preparers.length),
    map(() => true),
    startWith(false),
    shareReplay(1),
  );

  constructor() {
    this.authService.authorized$
      .pipe(
        pairwise(),
        map((pair) => pair[0] !== pair[1]),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }
}
