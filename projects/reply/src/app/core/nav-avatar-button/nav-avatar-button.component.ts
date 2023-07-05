import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'rpl-nav-avatar-button',
  templateUrl: './nav-avatar-button.component.html',
  styleUrls: ['./nav-avatar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAvatarButtonComponent {
  user$ = inject(AuthenticationService).user$;
}
