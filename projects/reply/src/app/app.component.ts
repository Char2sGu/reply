import { transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

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
      transition(':enter, :leave, * <=> Empty', []),
      transition('FoundationComponent => *', [
        SharedAxisAnimation.apply('z', 'forward', {
          incoming: ':enter',
          outgoing: ':leave rpl-content, :leave rpl-nav',
        }),
      ]),
      transition('* => FoundationComponent', [
        SharedAxisAnimation.apply('z', 'backward', {
          incoming: ':enter rpl-content, :enter rpl-nav',
          outgoing: ':leave',
        }),
      ]),
    ]),
  ],
})
export class AppComponent {
  @HostBinding('class') breakpointMap: BreakpointMap = {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  };

  breakpoints$ = this.breakpointManager.breakpoints$;

  constructor(
    private breakpointManager: BreakpointManager,
    private childRouterOutletContexts: ChildrenOutletContexts,
  ) {
    this.breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }

  getRouteComponentName(): string {
    return (
      this.childRouterOutletContexts.getContext('primary')?.route?.component
        ?.name ?? 'Empty'
    );
  }
}
