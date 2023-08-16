import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { CORE_STATE } from '@/app/state/core/core.state-entry';

@Component({
  selector: 'rpl-base-foundation',
  templateUrl: './base-foundation.component.html',
  styleUrls: ['./base-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFoundationComponent {
  private store = inject(Store);
  breakpoints = this.store.selectSignal(CORE_STATE.selectBreakpoints);
}
