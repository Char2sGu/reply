import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BREAKPOINTS } from '../breakpoint.service';

@Component({
  selector: 'rpl-base-foundation',
  templateUrl: './base-foundation.component.html',
  styleUrls: ['./base-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFoundationComponent {
  breakpoints = inject(BREAKPOINTS);
}
