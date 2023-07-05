import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'rpl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  checked = false;
  loading$ = this.authService.authorized$;

  constructor() {
    this.authService.authorized$
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }

  onButtonClick(): void {
    this.authService.requestAuthorization();
  }
}
