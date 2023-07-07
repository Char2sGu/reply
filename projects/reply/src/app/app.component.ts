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
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  bufferCount,
  catchError,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  startWith,
  timer,
} from 'rxjs';

import { environment } from '@/environments/environment';

import { injectAnimationIdFactory } from './core/animations';
import {
  AuthenticationService,
  Authorization,
} from './core/authentication.service';
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
  private iconRegistry = inject(MatIconRegistry);

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  private initializers = [
    this.googleApis$,
    this.iconRegistry.getNamedSvgIcon('').pipe(catchError(() => of(null))), // load all svg icon sets
  ];
  initialized$ = merge(...this.initializers, timer(1000)).pipe(
    bufferCount(this.initializers.length + 1),
    map(() => true),
    startWith(false),
  );

  constructor() {
    this.authService.authorized$
      .pipe(
        combineLatestWith(this.authService.user$),
        map(([v]) => v),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });

    /* eslint-disable no-console */
    if (!environment.production) {
      this.googleApis$.subscribe(() => {
        if (localStorage['authorization']) {
          const auth = JSON.parse(
            localStorage['authorization'],
          ) as Authorization;
          gapi.client.setToken({ ['access_token']: auth.token });
          this.authService.setAuthorization(auth);
          console.log('authorization restored', auth);
        }
      });
      this.authService.authorization$.pipe(filter(Boolean)).subscribe((r) => {
        localStorage['authorization'] = JSON.stringify(r);
        console.log('authorization saved', r);
      });
    }
    /* eslint-enable no-console */
  }
}
