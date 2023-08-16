import { inject, Injectable, NgModule } from '@angular/core';
import {
  CanMatchFn,
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { CORE_STATE } from './state/core/core.state-entry';

const authenticated: CanMatchFn = () =>
  inject(Store)
    .select(CORE_STATE.selectAuthenticated)
    .pipe(map((a) => !!a));
const notAuthenticated: CanMatchFn = () =>
  inject(Store)
    .select(CORE_STATE.selectAuthenticated)
    .pipe(map((a) => !a));

const routes: Routes = [
  {
    path: '',
    canMatch: [notAuthenticated],
    children: [
      {
        path: 'auth',
        data: { animationId: 'auth' },
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
    canMatch: [authenticated],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mailboxes/Inbox/mails',
      },
      {
        path: '',
        data: { animationId: 'main' },
        loadChildren: () =>
          import('./main/main.module').then((m) => m.MainModule),
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
