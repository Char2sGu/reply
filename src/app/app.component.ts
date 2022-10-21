import { Component, HostBinding } from '@angular/core';

import { BreakpointManager } from './core/breakpoint.manager';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class')
  breakpointMap = { sm: false, md: false, lg: false, xl: false };

  constructor(private breakpointManager: BreakpointManager) {
    this.breakpointManager.breakpoints$.subscribe((v) => {
      this.breakpointMap = v;
    });
  }
}
