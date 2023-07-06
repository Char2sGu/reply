import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);

  checked = false;
  loading$ = this.authService.authorized$;

  onButtonClick(): void {
    this.authService.requestAuthorization();
  }
}
