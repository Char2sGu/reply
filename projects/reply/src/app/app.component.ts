import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewChild,
} from '@angular/core';

import { SharedAxisAnimation } from './common/animations';
import { ChildRouteAnimationHost } from './common/child-route-animation-host';
import { BreakpointManager, BreakpointMap } from './core/breakpoint.manager';
import { LayoutAnimator } from './layout-projection/core/layout-animation';

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
export class AppComponent extends ChildRouteAnimationHost {
  @HostBinding('class') breakpointMap: BreakpointMap = {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  };

  breakpoints$ = this.breakpointManager.breakpoints$;
  navExpanded?: boolean = undefined;

  constructor(private breakpointManager: BreakpointManager) {
    super();
    this.breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }

  flag = false;

  @ViewChild(LayoutAnimator) animator!: LayoutAnimator;

  onClick(): void {
    this.animator.snapshot();
    this.flag = !this.flag;
    setTimeout(() => {
      this.animator.animate(500, 'ease');
    }, 1000);
  }
}
