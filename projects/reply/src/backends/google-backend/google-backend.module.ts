import { inject, ModuleWithProviders, NgModule } from '@angular/core';

import { ContactSyncService } from '@/app/entity/contact/contact-sync.service';
import { MailSyncService } from '@/app/entity/mail/mail-sync.service';

import { AuthenticationService } from '../../app/core/authorization.service';
import { APP_PREPARER, AppPreparer } from '../../app/core/preparation';
import { ContactService } from '../../app/entity/contact/contact.service';
import { MailService } from '../../app/entity/mail/mail.service';
import { MailboxService } from '../../app/entity/mailbox/mailbox.service';
import { GoogleAuthenticationService } from './auth/google-authentication.service';
import { GoogleContactService } from './contact/google-contact.service';
import { GoogleContactSyncService } from './contact/google-contact-sync.service';
import { GOOGLE_APIS } from './core/google-apis.object';
import { GOOGLE_CLIENT_ID } from './core/google-client-id.token';
import {
  JsonTokenAggregator,
  TokenAggregator,
} from './core/token-aggregator.service';
import { GoogleMailService } from './mail/google-mail.service';
import { GoogleMailSyncService } from './mail/google-mail-sync.service';
import { GoogleMailboxService } from './mailbox/google-mailbox.service';

@NgModule({
  providers: [
    {
      provide: TokenAggregator,
      useClass: JsonTokenAggregator,
    },
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
      provide: ContactService,
      useClass: GoogleContactService,
    },
    {
      provide: ContactSyncService,
      useClass: GoogleContactSyncService,
    },
    {
      provide: MailService,
      useClass: GoogleMailService,
    },
    {
      provide: MailSyncService,
      useClass: GoogleMailSyncService,
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
