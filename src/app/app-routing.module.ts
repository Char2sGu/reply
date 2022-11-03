import { Injectable, NgModule } from '@angular/core';
import {
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'mailboxes/Inbox/mails',
  },
  {
    path: 'mailboxes/:mailboxName/mails',
    loadChildren: () =>
      import('./mails/mails.module').then((m) => m.MailsModule),
  },
];

@Injectable()
export class AppTitleStrategy extends DefaultTitleStrategy {
  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const title = super.buildTitle(snapshot);
    return title && `${title} | Reply`;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
})
export class AppRoutingModule {}
