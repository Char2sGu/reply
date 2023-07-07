import { inject, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { GOOGLE_APIS } from './google-apis.token';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GOOGLE_CLIENT_ID } from './google-client-id.token';

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
export class GoogleBackendModule {
  static configure(
    config: GoogleBackendConfig,
  ): ModuleWithProviders<GoogleBackendModule> {
    return {
      ngModule: GoogleBackendModule,
      providers: [
        {
          provide: GOOGLE_CLIENT_ID,
          useValue: config.clientId,
        },
      ],
    };
  }
}

export interface GoogleBackendConfig {
  clientId: string;
}
