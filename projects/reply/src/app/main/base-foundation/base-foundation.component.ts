import { ChangeDetectionStrategy, Component } from '@angular/core';

import { useBreakpoints } from '@/app/core/breakpoint.utils';

@Component({
  selector: 'rpl-base-foundation',
  templateUrl: './base-foundation.component.html',
  styleUrls: ['./base-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFoundationComponent {
  breakpoints = useBreakpoints();
}
