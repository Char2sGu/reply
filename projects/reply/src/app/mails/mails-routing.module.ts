import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn,
  RouterModule,
  Routes,
  UrlMatcher,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { VirtualMailboxName } from '../core/mailbox-name.enums';
import { MAILBOX_STATE } from '../state/mailbox/mailbox.state-entry';
import { MailsComponent } from './mails.component';

const mailboxNameValid: CanActivateFn = (route) => {
  const store = inject(Store);
  const mailboxName: string = route.params['mailboxName'];
  const virtualMailboxNames = Object.values(VirtualMailboxName) as string[];
  if (virtualMailboxNames.includes(mailboxName)) return true;
  return store
    .select(MAILBOX_STATE.selectMailboxes)
    .pipe(map((m) => !!m.queryOne((e) => e.name === mailboxName)));
};

const routes: Routes = [
  {
    path: 'mailboxes/:mailboxName/mails',
    canActivate: [mailboxNameValid],
    title: (route) => route.params['mailboxName'],
    children: [
      {
        matcher: (segments): ReturnType<UrlMatcher> => {
          if (segments.length === 0)
            return {
              consumed: segments,
              posParams: {},
            };
          if (segments.length === 1)
            return {
              consumed: segments,
              posParams: { ['mailId']: segments[0] },
            };
          return null;
        },
        component: MailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
