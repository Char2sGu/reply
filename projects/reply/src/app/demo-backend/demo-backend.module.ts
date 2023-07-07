import { DOCUMENT } from '@angular/common';
import { inject, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { INITIALIZER, Initializer } from '../core/initialization';
import { ReactiveRepository } from '../core/reactive-repository';
import { ContactRepository } from '../data/contact.repository';
import { MailRepository } from '../data/mail.repository';
import { CONTACTS } from './data/contact.records';
import { MAILS } from './data/mail.records';
import { DemoAuthenticationService } from './demo-authentication.service';

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
  ],
})
export class DemoBackendModule {
  constructor() {
    const populateRepo = <T>(
      repo: ReactiveRepository<T>,
      entities: readonly T[],
    ) => entities.forEach((e) => repo.insert(e));

    populateRepo(inject(ContactRepository), CONTACTS);
    populateRepo(inject(MailRepository), MAILS);
  }
}
