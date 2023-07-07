import { inject, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { GOOGLE_APIS } from './google-apis.token';
import { GoogleAuthenticationService } from './google-authentication.service';

@NgModule({
  providers: [
    {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
        const googleApis$ = inject(GOOGLE_APIS);
        return () => googleApis$;
      },
      multi: true,
    },
    {
      provide: AuthenticationService,
      useClass: GoogleAuthenticationService,
    },
  ],
})
export class GoogleBackendModule {}
