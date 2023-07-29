import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { filter } from 'rxjs';

import { environment } from '@/environments/environment';

import {
  AuthenticationService,
  Authorization,
} from '../core/auth/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { ContactBackend } from '../data/contact/contact.backend';
import { MailBackend } from '../data/mail/mail.backend';
import { MailboxBackend } from '../data/mailbox/mailbox.backend';
import { GOOGLE_APIS } from './core/google-apis.token';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleContactBackend } from './google-contact.backend';
import { GoogleMailBackend } from './google-mail.backend';
import { GoogleMailboxBackend } from './google-mailbox.backend';

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
      provide: ContactBackend,
      useClass: GoogleContactBackend,
    },
    {
      provide: MailBackend,
      useClass: GoogleMailBackend,
    },
    {
      provide: MailboxBackend,
      useClass: GoogleMailboxBackend,
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
