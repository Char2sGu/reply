import { Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterModule,
  Routes,
} from '@angular/router';

import { MailsComponent } from './mails.component';

@Injectable({ providedIn: 'root' })
export class MailCategoryRouteTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    const categoryName: string = route.params['categoryName'];
    return `${categoryName[0].toUpperCase()}${categoryName.slice(1)}`;
  }
}

@Injectable({ providedIn: 'root' })
export class MailFolderRouteTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    const folderName: string = route.params['folderName'];
    return folderName;
  }
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inbox',
  },
  {
    path: ':categoryName',
    component: MailsComponent,
    title: MailCategoryRouteTitleResolver,
  },
  {
    path: 'folder/:folderName',
    component: MailsComponent,
    title: MailFolderRouteTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
