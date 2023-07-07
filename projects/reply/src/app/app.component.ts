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
import { Router } from '@angular/router';
import {
  bufferCount,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  timer,
} from 'rxjs';

import { injectAnimationIdFactory } from './core/animations';
import { AuthenticationService } from './core/authentication.service';
import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';
import { GOOGLE_APIS } from './core/google-apis.token';

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
  private googleApis$ = inject(GOOGLE_APIS);

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  initialized$ = merge(this.googleApis$, timer(1000)).pipe(
    bufferCount(2),
    map(() => true),
    startWith(false),
  );

  constructor() {
    this.authService.authorized$.pipe(distinctUntilChanged()).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
