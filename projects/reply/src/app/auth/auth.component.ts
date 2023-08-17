import {
  animate,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AnimationCurves } from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, concatMap, filter, first, timer } from 'rxjs';

import { CORE_STATE } from '../state/core/core.state-entry';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('main', [
      state(
        'loading',
        style({ width: '100%', height: '100%', maxWidth: '100%' }),
      ),
      transition('default <=> loading', [
        group([
          query(':self', [animate(`350ms ${AnimationCurves.STANDARD_CURVE}`)]),
          query(':enter', [
            style({ opacity: '0' }),
            animate(`350ms ${AnimationCurves.STANDARD_CURVE}`),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class AuthComponent {
  private store = inject(Store);
  private router = inject(Router);

  private authenticationStatus = this.store.selectSignal(
    CORE_STATE.selectAuthenticationStatus,
  );

  showLoading = computed(() => {
    const status = this.authenticationStatus();
    return status.type === 'pending' || status.type === 'completed';
  });

  constructor() {
    const authenticationStatus$ = toObservable(this.authenticationStatus);
    const showLoading$ = toObservable(this.showLoading);
    showLoading$
      .pipe(
        filter(Boolean),
        concatMap(() =>
          combineLatest([
            authenticationStatus$.pipe(filter((s) => s.type === 'completed')),
            timer(500),
          ]).pipe(first()),
        ),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }
}
