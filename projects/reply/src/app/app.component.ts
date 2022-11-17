import { transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { ChildRouteAnimationHost } from './common/child-route-animation-host';
import { SharedAxisAnimation } from './core/animations';
import { BreakpointManager, BreakpointMap } from './core/breakpoint.manager';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // remove the initial entering animations of nav elements
    trigger('nav', [transition(':enter', [])]),
    trigger('wrapper', [
      transition(':enter, :leave, * <=> none', []),
      transition('base => upper', [
        SharedAxisAnimation.apply('z', 'forward', {
          incoming: ':enter main',
          outgoing: ':leave rpl-content, rpl-bottom-nav',
        }),
      ]),
      transition('upper => base', [
        SharedAxisAnimation.apply('z', 'backward', {
          incoming: ':enter rpl-content, rpl-bottom-nav',
          outgoing: ':leave main',
        }),
      ]),
    ]),
  ],
})
export class AppComponent extends ChildRouteAnimationHost {
  @HostBinding('class') breakpointMap: BreakpointMap = {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  };

  breakpoints$ = this.breakpointManager.breakpoints$;

  constructor(private breakpointManager: BreakpointManager) {
    super();
    this.breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }
}
