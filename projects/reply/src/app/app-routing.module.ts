import { inject, Injectable, NgModule } from '@angular/core';
import {
  CanMatchFn,
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { map } from 'rxjs';

import { AuthenticationService } from './core/authentication.service';
import { BaseFoundationComponent } from './core/base-foundation/base-foundation.component';
import { FoundationComponent } from './core/foundation/foundation.component';
import { UpperFoundationComponent } from './core/upper-foundation/upper-foundation.component';

const authorized: CanMatchFn = () => inject(AuthenticationService).authorized$;
const unauthorized: CanMatchFn = () =>
  inject(AuthenticationService).authorized$.pipe(map((a) => !a));

const routes: Routes = [
  {
    path: '',
    canMatch: [unauthorized],
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        redirectTo: 'auth',
      },
    ],
  },
  {
    path: '',
    component: FoundationComponent,
    canMatch: [authorized],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mailboxes/Inbox/mails',
      },
      {
        path: '',
        component: BaseFoundationComponent,
        data: { animationId: 'base' },
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
        data: { animationId: 'upper' },
        children: [
          {
            path: 'auth',
            loadChildren: () =>
              import('./auth/auth.module').then((m) => m.AuthModule),
          },
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
    ],
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
