import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  signal,
} from '@angular/core';

import {
  injectAnimationIdFactory,
  SharedAxisAnimation,
} from './common/animations';
import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('wrapper', [
      transition(':enter, :leave, * <=> none', []),
      transition('base => upper', [
        SharedAxisAnimation.apply('z', 'forward', {
          incoming: ':enter [data-route-animation="root"]',
          outgoing: ':leave [data-route-animation="root"]',
        }),
      ]),
      transition('upper => base', [
        SharedAxisAnimation.apply('z', 'backward', {
          incoming: ':enter [data-route-animation="root"]',
          outgoing: ':leave [data-route-animation="root"]',
        }),
      ]),
    ]),
  ],
})
export class AppComponent {
  routeAnimationId = injectAnimationIdFactory();
  breakpoints = inject(BREAKPOINTS);

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  navShouldRender = computed(() => this.breakpoints()['tablet-portrait']);
  navShouldExpand = computed(() => this.breakpoints()['laptop']);
  navExpanded = signal<boolean | undefined>(undefined);
}
