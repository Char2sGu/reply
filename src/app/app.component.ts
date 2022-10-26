import { transition, trigger } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';

import { BreakpointManager, BreakpointMap } from './core/breakpoint.manager';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // remove entering animations of all child elements of the target
    trigger('enterRemoved', [transition(':enter', [])]),
  ],
})
export class AppComponent {
  @HostBinding('class')
  breakpointMap: BreakpointMap = {
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
