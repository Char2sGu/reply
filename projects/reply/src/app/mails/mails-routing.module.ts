import { inject, NgModule } from '@angular/core';
import {
  ResolveFn,
  RouterModule,
  Routes,
  UrlMatcher,
  UrlSegment,
} from '@angular/router';
import { filter, map, shareReplay } from 'rxjs';

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
    resolve: { mailbox: mailboxResolver },
    title: (route) => route.params['mailboxName'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
