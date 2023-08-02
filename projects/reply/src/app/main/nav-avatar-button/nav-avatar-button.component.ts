import { ChangeDetectionStrategy, Component } from '@angular/core';

import { useState } from '@/app/core/state';
import { USER } from '@/app/core/user.state';

@Component({
  selector: 'rpl-nav-avatar-button',
  templateUrl: './nav-avatar-button.component.html',
  styleUrls: ['./nav-avatar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAvatarButtonComponent {
  user = useState(USER);
}
