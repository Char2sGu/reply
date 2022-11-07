import { transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { BreakpointManager, BreakpointMap } from './core/breakpoint.manager';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // remove the initial entering animations of nav elements
    trigger('nav', [transition(':enter', [])]),
  ],
})
export class AppComponent {
  @HostBinding('class') breakpointMap: BreakpointMap = {
    ['tablet-portrait']: false,
    ['tablet-landscape']: false,
    ['laptop']: false,
    ['desktop']: false,
  };

  constructor(breakpointManager: BreakpointManager) {
    breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }
}
