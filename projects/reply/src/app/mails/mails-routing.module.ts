import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn,
  ResolveFn,
  RouterModule,
  Routes,
  UrlMatcher,
  UrlSegment,
} from '@angular/router';
import { filter, first, map, shareReplay } from 'rxjs';

import { VirtualMailboxName } from '../core/mailbox-name.enums';
import { Mailbox } from '../data/mailbox.model';
import { MailboxRepository } from '../data/mailbox.repository';
import { MailsComponent } from './mails.component';

const mailboxResolver: ResolveFn<Mailbox> = (route) =>
  inject(MailboxRepository)
    .query((e) => e.name === route.params['mailboxName'])
    .pipe(
      map((results) => results.at(0)),
      filter(Boolean),
      shareReplay(1),
    );

const mailboxNameValid: CanActivateFn = (route) => {
  const mailboxName: string = route.params['mailboxName'];
  const virtualMailboxNames = Object.values(VirtualMailboxName) as string[];
  if (virtualMailboxNames.includes(mailboxName)) return true;
  return inject(MailboxRepository)
    .query((e) => e.name === route.params['mailboxName'])
    .pipe(
      map((results) => results.at(0)),
      map(Boolean),
      first(),
    );
};

const routes: Routes = [
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
          posParams: {
            ['mailId']: new UrlSegment(segments[0].path, {}),
          },
        };
      return null;
    },
    component: MailsComponent,
    canActivate: [mailboxNameValid],
    resolve: { mailbox: mailboxResolver },
    title: (route) => route.params['mailboxName'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
