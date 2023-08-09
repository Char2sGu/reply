import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { CONTACT_STATE } from '@/app/core/state/contact/contact.state-entry';

@Component({
  selector: 'rpl-nav-avatar-button',
  templateUrl: './nav-avatar-button.component.html',
  styleUrls: ['./nav-avatar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAvatarButtonComponent {
  private store = inject(Store);
  user = this.store.selectSignal(CONTACT_STATE.selectCurrent);
}
