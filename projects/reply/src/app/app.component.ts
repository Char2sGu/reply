import { animate, style, transition, trigger } from '@angular/animations';
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

import { AuthenticationService } from './core/authentication.service';
import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';
import { GOOGLE_APIS } from './core/google-apis.token';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('launchScreen', [
      transition(':leave', [
        animate(
          `300ms ${AnimationCurves.STANDARD_CURVE}`,
          style({ opacity: 0 }),
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
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
