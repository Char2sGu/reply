import { inject, NgModule } from '@angular/core';
import { CanMatchFn, RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { ACCOUNT_STATE } from '../state/account/account.state-entry';
import { AuthComponent } from './auth.component';
import { AuthNoAccountComponent } from './auth-no-account/auth-no-account.component';
import { AuthSelectAccountComponent } from './auth-select-account/auth-select-account.component';

const existsAccounts: CanMatchFn = () =>
  inject(Store)
    .select(ACCOUNT_STATE.selectAccounts)
    .pipe(map((accounts) => !!accounts.all().length));

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        canMatch: [existsAccounts],
        component: AuthSelectAccountComponent,
      },
      {
        path: '',
        component: AuthNoAccountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
