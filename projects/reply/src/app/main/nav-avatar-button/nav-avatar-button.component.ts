import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { USER } from '@/app/core/user.object';

@Component({
  selector: 'rpl-nav-avatar-button',
  templateUrl: './nav-avatar-button.component.html',
  styleUrls: ['./nav-avatar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAvatarButtonComponent {
  user = inject(USER);
}
