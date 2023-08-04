import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/auth/authentication.service';
import { ContactConductor } from '../data/contact/contact.conductor';
import { MailConductor } from '../data/mail/mail.conductor';
import { MailboxConductor } from '../data/mailbox/mailbox.conductor';
import { DemoAuthenticationService } from './demo-authentication.service';
import { DemoContactService } from './demo-contact.service';
import { DemoMailService } from './demo-mail.service';
import { DemoMailboxService } from './demo-mailbox.service';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const document = inject(DOCUMENT);
        return () => {
          const mark = document.createElement('div');
          mark.innerText = 'DEMO';
          mark.style.position = 'fixed';
          mark.style.bottom = '0';
          mark.style.right = '0';
          mark.style.padding = '4px 8px';
          mark.style.color = 'white';
          mark.style.backgroundColor = 'black';
          mark.style.opacity = '60%';
          mark.style.zIndex = '10000';
          mark.style.pointerEvents = 'none';
          document.body.appendChild(mark);
        };
      },
      multi: true,
    },
    {
      provide: AuthenticationService,
      useClass: DemoAuthenticationService,
    },
    {
      provide: ContactConductor,
      useClass: DemoContactService,
    },
    {
      provide: MailboxConductor,
      useClass: DemoMailboxService,
    },
    {
      provide: MailConductor,
      useClass: DemoMailService,
    },
  ],
})
export class DemoBackendModule {}
