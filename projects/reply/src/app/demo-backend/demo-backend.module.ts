import { inject, NgModule } from '@angular/core';

import { AuthenticationService } from '../core/authentication.service';
import { ReactiveRepository } from '../core/reactive-repository';
import { ContactRepository } from '../data/contact.repository';
import { MailRepository } from '../data/mail.repository';
import { CONTACTS } from './data/contact.records';
import { MAILS } from './data/mail.records';
import { DemoAuthenticationService } from './demo-authentication.service';

@NgModule({
  providers: [
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
