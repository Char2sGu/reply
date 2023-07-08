import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { filter } from 'rxjs';

import { environment } from '@/environments/environment';

import {
  AuthenticationService,
  Authorization,
} from '../core/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { MailService } from '../data/mail.service';
import { MailboxService } from '../data/mailbox.service';
import { GOOGLE_APIS } from './core/google-apis.token';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleMailService } from './google-mail.service';
import { GoogleMailboxService } from './google-mailbox.service';

@NgModule({
  providers: [
    {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
        const apis$ = inject(GOOGLE_APIS);
        return () => apis$;
      },
      multi: true,
    },
    {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
        if (environment.production) return () => {};
        const apis$ = inject(GOOGLE_APIS);
        const authService = inject(AuthenticationService);
        return () => {
          /* eslint-disable no-console */
          apis$.subscribe(() => {
            if (localStorage['authorization']) {
              const auth: Authorization = JSON.parse(
                localStorage['authorization'],
              );
              gapi.client.setToken({ ['access_token']: auth.token });
              authService.setAuthorization(auth);
              console.log('authorization restored', auth);
            }
          });
          authService.authorization$.pipe(filter(Boolean)).subscribe((r) => {
            localStorage['authorization'] = JSON.stringify(r);
            console.log('authorization saved', r);
          });
          /* eslint-enable no-console */
        };
      },
      multi: true,
    },
    {
      provide: AuthenticationService,
      useClass: GoogleAuthenticationService,
    },
    {
      provide: MailService,
      useClass: GoogleMailService,
    },
    {
      provide: MailboxService,
      useClass: GoogleMailboxService,
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
