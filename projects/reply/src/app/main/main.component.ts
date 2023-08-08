import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import {
  SharedAxisAnimation,
  usePrimaryChildRouteAnimationId,
} from '../core/animations';
import { CORE_STATE } from '../core/state/core.state-entry';

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
  private store = inject(Store);

  animationId = usePrimaryChildRouteAnimationId();

  private breakpoints = this.store.selectSignal(CORE_STATE.selectBreakpoints);
  navShouldRender = computed(() => this.breakpoints()['tablet-portrait']);
  navShouldExpand = computed(() => this.breakpoints()['laptop']);

  navExpanded = signal<boolean | undefined>(undefined);
}
