import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { useActionFlow } from '../core/action-flow';
import { AuthenticationService } from '../core/auth/authentication.service';
import { AuthenticateActionFlow } from './auth.action-flows';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);
  private authenticate = useActionFlow(AuthenticateActionFlow);

  checked = false;
  loading$ = this.authService.authorization$.pipe(map(Boolean));

  onButtonClick(): void {
    this.authenticate().subscribe();
  }
}
