import { inject, Injectable, Provider } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { INITIALIZER, Initializer } from './initialization';
import { PersistentValue } from './persistent-value';

@Injectable({
  providedIn: 'root',
})
export class AuthorizedEmailPersistentValue extends PersistentValue<string> {
  static provideInitializer(): Provider {
    return {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
        const auth = inject(AuthenticationService);
        const value = inject(this);
        return () => {
          combineLatest([auth.authorized$, auth.user$])
            .pipe(map(([authorized, user]) => (authorized ? user : null)))
            .subscribe((user) => {
              if (user) value.set(user.email);
              else value.clear();
            });
        };
      },
      multi: true,
    };
  }

  readonly key = 'authorized-email';
}
