import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { combineLatest, filter, firstValueFrom } from 'rxjs';

import { SessionService } from '../core/session.service';
import { ContactService } from '../data/contact/contact.service';
import { MailService } from '../data/mail/mail.service';
import { MailboxService } from '../data/mailbox/mailbox.service';
import { BaseFoundationComponent } from './base-foundation/base-foundation.component';
import { MainComponent } from './main.component';
import { UpperFoundationComponent } from './upper-foundation/upper-foundation.component';

const dataInitializer: CanActivateFn = async () => {
  const userService = inject(SessionService);
  const contactService = inject(ContactService);
  const mailboxService = inject(MailboxService);
  const mailService = inject(MailService);

  await firstValueFrom(userService.user$.pipe(filter(Boolean)));
  await firstValueFrom(
    combineLatest([
      mailboxService.loadMailboxes(),
      contactService.loadContacts(),
    ]),
  );
  await firstValueFrom(mailService.loadMails());

  return true;
};

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [dataInitializer],
    children: [
      {
        path: '',
        component: BaseFoundationComponent,
        data: { animationId: 'base' },
        children: [
          {
            matcher: (segments) => {
              if (!segments.length) return null;
              const path = segments.join('/');
              if (path.startsWith('mail'))
                return { consumed: [], posParams: {} };
              return null;
            },
            loadChildren: () =>
              import('../mails/mails.module').then((m) => m.MailsModule),
          },
        ],
      },
      {
        path: '',
        component: UpperFoundationComponent,
        data: { animationId: 'upper' },
        children: [
          {
            path: 'compose',
            loadChildren: () =>
              import('../compose/compose.module').then((m) => m.ComposeModule),
          },
          {
            path: 'search',
            loadChildren: () =>
              import('../search/search.module').then((m) => m.SearchModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
