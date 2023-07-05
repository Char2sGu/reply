import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';

import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private breakpoints = inject(BREAKPOINTS);
  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }
}
