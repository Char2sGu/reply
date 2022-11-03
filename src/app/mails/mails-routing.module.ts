import { Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterModule,
  Routes,
} from '@angular/router';

import { MailsComponent } from './mails.component';

@Injectable({ providedIn: 'root' })
export class MailboxRouteTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    return route.params['mailboxName'];
  }
}

const routes: Routes = [
  {
    path: '',
    component: MailsComponent,
    title: MailboxRouteTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
