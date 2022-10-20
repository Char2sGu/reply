import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { AppTitleStrategy } from './core/app.title-strategy';

const routes: Routes = [
  {
    path: 'inbox',
    title: 'Inbox',
    loadChildren: () =>
      import('./inbox/inbox.module').then((m) => m.InboxModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inbox',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
})
export class AppRoutingModule {}
