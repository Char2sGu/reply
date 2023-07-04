import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MailDetailLayoutComponent } from './mail-detail-layout/mail-detail-layout.component';
import { MailListLayoutComponent } from './mail-list-layout/mail-list-layout.component';
import { MailsComponent } from './mails.component';

const routes: Routes = [
  {
    path: '',
    component: MailsComponent,
    title: (route) => route.params['mailboxName'],
    children: [
      {
        path: '',
        component: MailListLayoutComponent,
        data: { animationId: 'list' },
      },
      {
        path: ':mailId',
        component: MailDetailLayoutComponent,
        data: { animationId: 'detail' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
