import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';

import { AuthenticationService } from '@/app/core/auth/authentication.service';
import { ContactService } from '@/app/entity/contact/contact.service';
import { MailService } from '@/app/entity/mail/mail.service';
import { MailboxService } from '@/app/entity/mailbox/mailbox.service';

import { DemoAuthenticationService } from './auth/demo-authentication.service';
import { DemoContactService } from './contact/demo-contact.service';
import { DemoMailService } from './mail/demo-mail.service';
import { DemoMailboxService } from './mailbox/demo-mailbox.service';

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
      provide: ContactService,
      useClass: DemoContactService,
    },
    {
      provide: MailboxService,
      useClass: DemoMailboxService,
    },
    {
      provide: MailService,
      useClass: DemoMailService,
    },
  ],
})
export class DemoBackendModule {}
