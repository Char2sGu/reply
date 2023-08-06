import { inject, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthenticationBackend } from '../core/auth/authentication.backend';
import { APP_PREPARER, AppPreparer } from '../core/preparation';
import { ContactBackend } from '../data/contact/contact.backend';
import { MailBackend } from '../data/mail/mail.backend';
import { MailboxBackend } from '../data/mailbox/mailbox.backend';
import { GoogleAuthenticationBackend } from './auth/google-authentication.backend';
import { GoogleContactBackend } from './contact/google-contact.backend';
import { GOOGLE_APIS } from './core/google-apis.object';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';
import { GoogleMailBackend } from './mail/google-mail.backend';
import { GoogleMailboxBackend } from './mailbox/google-mailbox.backend';

@NgModule({
  providers: [
    {
      provide: APP_PREPARER,
      useFactory: (): AppPreparer => {
        const apis$ = inject(GOOGLE_APIS);
        return () => apis$;
      },
      multi: true,
    },
    {
      provide: AuthenticationBackend,
      useClass: GoogleAuthenticationBackend,
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
