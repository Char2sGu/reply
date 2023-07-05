import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  injectAnimationIdFactory,
  SharedAxisAnimation,
} from '../core/animations';
import { BREAKPOINTS } from '../core/breakpoint.service';

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
export class MainComponent {
  routeAnimationId = injectAnimationIdFactory();
  private breakpoints = inject(BREAKPOINTS);

  navShouldRender = computed(() => this.breakpoints()['tablet-portrait']);
  navShouldExpand = computed(() => this.breakpoints()['laptop']);

  navExpanded = signal<boolean | undefined>(undefined);
}
