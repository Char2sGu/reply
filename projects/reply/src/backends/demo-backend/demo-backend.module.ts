import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';

import { AuthenticationService } from '@/app/core/auth/authentication.service';
import { ContactBackend } from '@/app/entity/contact/contact.backend';
import { MailBackend } from '@/app/entity/mail/mail.backend';
import { MailboxBackend } from '@/app/entity/mailbox/mailbox.backend';

import { DemoAuthenticationService } from './auth/demo-authentication.service';
import { DemoContactBackend } from './contact/demo-contact.backend';
import { DemoMailBackend } from './mail/demo-mail.backend';
import { DemoMailboxBackend } from './mailbox/demo-mailbox.backend';

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
      provide: ContactBackend,
      useClass: DemoContactBackend,
    },
    {
      provide: MailboxBackend,
      useClass: DemoMailboxBackend,
    },
    {
      provide: MailBackend,
      useClass: DemoMailBackend,
    },
  ],
})
export class DemoBackendModule {}
