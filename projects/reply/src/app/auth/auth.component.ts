import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { AuthorizedEmailPersistentValue } from '../core/authorized-email.persistent-value';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);
  private authorizedEmail = inject(AuthorizedEmailPersistentValue);

  checked = false;
  loading$ = this.authService.authorized$;

  constructor() {
    const authorizedEmail = this.authorizedEmail.get();
    if (authorizedEmail) {
      this.checked = true;
      this.authService.requestAuthorization(authorizedEmail);
    }
  }

  onButtonClick(): void {
    this.authService.requestAuthorization();
  }
}
