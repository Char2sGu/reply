import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatcher, UrlSegment } from '@angular/router';

import { MailsComponent } from './mails.component';

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
    title: (route) => route.params['mailboxName'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
