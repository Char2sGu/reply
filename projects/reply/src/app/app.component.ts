import { transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  injectAnimationIdFactory,
  SharedAxisAnimation,
} from './common/animations';
import { BreakpointManager, BreakpointMap } from './core/breakpoint.manager';

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
export class AppComponent {
  routeAnimationId = injectAnimationIdFactory();

  @HostBinding('class') breakpointMap: BreakpointMap = {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  };

  breakpoints$ = this.breakpointManager.breakpoints$;
  navExpanded?: boolean = undefined;

  constructor(private breakpointManager: BreakpointManager) {
    this.breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }

  flag$ = new BehaviorSubject(true);

  onClick(): void {
    this.flag$.next(!this.flag$.value);
  }
}
