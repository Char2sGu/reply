import { inject, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthenticationService } from '../../app/core/auth/authentication.service';
import { APP_PREPARER, AppPreparer } from '../../app/core/preparation';
import { ContactBackend } from '../../app/entity/contact/contact.backend';
import { MailBackend } from '../../app/entity/mail/mail.backend';
import { MailboxBackend } from '../../app/entity/mailbox/mailbox.backend';
import { GoogleAuthenticationService } from './auth/google-authentication.service';
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
