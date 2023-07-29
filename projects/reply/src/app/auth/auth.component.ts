import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

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
  loading$ = this.authService.authorization$.pipe(map(Boolean));

  onButtonClick(): void {
    this.authService.requestAuthorization();
  }
}
