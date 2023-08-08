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

import { CORE_STATE } from './core/state/core.state-entry';

const authorized: CanMatchFn = () =>
  inject(Store)
    .select(CORE_STATE.selectAuthorized)
    .pipe(map((a) => !!a));
const unauthorized: CanMatchFn = () =>
  inject(Store)
    .select(CORE_STATE.selectAuthorized)
    .pipe(map((a) => !a));

const routes: Routes = [
  {
    path: '',
    canMatch: [unauthorized],
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
    canMatch: [authorized],
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
