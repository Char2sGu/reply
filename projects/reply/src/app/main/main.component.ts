import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import {
  SharedAxisAnimation,
  usePrimaryChildRouteAnimationId,
} from '../core/animations';
import { useBreakpoints } from '../core/breakpoint.utils';
import { LAYOUT_CONTEXT } from '../core/layout-context.state';
import { useWritableState } from '../core/state';

@Component({
  selector: 'rpl-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('content', [
      transition(':enter, :leave, * <=> none', []),
      transition('base => upper', [
        SharedAxisAnimation.apply('z', 'forward', {
          incoming: ':enter [data-route-animation-target]',
          outgoing: ':leave [data-route-animation-target]',
        }),
      ]),
      transition('upper => base', [
        SharedAxisAnimation.apply('z', 'backward', {
          incoming: ':enter [data-route-animation-target]',
          outgoing: ':leave [data-route-animation-target]',
        }),
      ]),
    ]),
  ],
})
export class MainComponent {
  private router = inject(Router);

  private breakpoints = useBreakpoints();
  private layoutContext = useWritableState(LAYOUT_CONTEXT);

  animationId = usePrimaryChildRouteAnimationId();

  navShouldRender = computed(() => this.breakpoints()['tablet-portrait']);
  navShouldExpand = computed(() => this.breakpoints()['laptop']);

  navExpanded = signal<boolean | undefined>(undefined);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.layoutContext.mutate((c) => {
          c.contentFavored = false;
        });
      });
  }
}
