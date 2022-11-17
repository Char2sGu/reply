import { Injectable, NgModule } from '@angular/core';
import {
  DefaultTitleStrategy,
  PreloadAllModules,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';

import { BaseFoundationComponent } from './core/base-foundation/base-foundation.component';
import { UpperFoundationComponent } from './core/upper-foundation/upper-foundation.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'mailboxes/Inbox/mails',
  },
  {
    path: '',
    component: BaseFoundationComponent,
    children: [
      {
        path: 'mailboxes/:mailboxName/mails',
        loadChildren: () =>
          import('./mails/mails.module').then((m) => m.MailsModule),
      },
    ],
  },
  {
    path: '',
    component: UpperFoundationComponent,
    children: [
      {
        path: 'compose',
        loadChildren: () =>
          import('./compose/compose.module').then((m) => m.ComposeModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'mailboxes/Inbox/mails',
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
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
})
export class AppRoutingModule {}
