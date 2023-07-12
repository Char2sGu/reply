import { DOCUMENT } from '@angular/common';
import { inject, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { ContactService } from '../data/contact.service';
import { MailService } from '../data/mail.service';
import { MailboxService } from '../data/mailbox.service';
import { DemoAuthenticationService } from './demo-authentication.service';
import { DemoContactService } from './demo-contact.service';
import { DemoMailService } from './demo-mail.service';
import { DemoMailboxService } from './demo-mailbox.service';

@NgModule({
  providers: [
    {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
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
