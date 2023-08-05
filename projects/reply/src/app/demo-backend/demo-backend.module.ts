import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';

import { AuthenticationBackend } from '../core/auth/authentication.backend';
import { ContactBackend } from '../data/contact/contact.backend';
import { MailBackend } from '../data/mail/mail.backend';
import { MailboxBackend } from '../data/mailbox/mailbox.backend';
import { DemoAuthenticationBackend } from './demo-authentication.backend';
import { DemoContactBackend } from './demo-contact.backend';
import { DemoMailBackend } from './demo-mail.backend';
import { DemoMailboxBackend } from './demo-mailbox.backend';

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
      provide: AuthenticationBackend,
      useClass: DemoAuthenticationBackend,
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
