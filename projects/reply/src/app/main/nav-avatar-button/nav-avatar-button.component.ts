import { ChangeDetectionStrategy, Component } from '@angular/core';

import { useUser } from '@/app/core/user.state';

@Component({
  selector: 'rpl-nav-avatar-button',
  templateUrl: './nav-avatar-button.component.html',
  styleUrls: ['./nav-avatar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAvatarButtonComponent {
  user$ = useUser();
}
