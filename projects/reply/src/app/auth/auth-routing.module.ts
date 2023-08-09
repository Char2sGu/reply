import { inject, NgModule } from '@angular/core';
import { CanMatchFn, RouterModule, Routes } from '@angular/router';

import { AccountRepository } from '../entity/account/account.repository';
import { AuthComponent } from './auth.component';
import { AuthNoAccountComponent } from './auth-no-account/auth-no-account.component';
import { AuthSelectAccountComponent } from './auth-select-account/auth-select-account.component';

const existsAccounts: CanMatchFn = () => {
  const accountRepo = inject(AccountRepository);
  return !!accountRepo.query().snapshot.length;
};

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
