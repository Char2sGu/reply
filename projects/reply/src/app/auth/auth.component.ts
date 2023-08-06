import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthenticationConductor } from '../core/auth/authentication.conductor';
import { AuthenticationService } from '../core/auth/authentication.service';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);
  private authConductor = inject(AuthenticationConductor);

  checked = false;
  loading$ = this.authService.authorized$;

  onButtonClick(): void {
    this.authConductor.requestAuthorization().subscribe();
  }
}
