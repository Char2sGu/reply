import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';

import { ActionFlow } from '../core/action-flow';
import { AuthenticationService } from '../core/auth/authentication.service';
import { USER } from '../core/user.state';
import { ContactService } from '../data/contact/contact.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateActionFlow implements ActionFlow {
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactService);
  private user$ = inject(USER);

  execute(): Observable<void> {
    return this.authService.requestAuthorization().pipe(
      switchMap((success) => {
        if (!success) return of(undefined);
        return this.contactService.loadUser().pipe(
          tap((user) => this.user$.next(user)),
          map(() => undefined),
        );
      }),
    );
  }
}
