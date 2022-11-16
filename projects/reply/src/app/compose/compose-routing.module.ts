import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComposeComponent } from './compose.component';

const routes: Routes = [
  { path: '', component: ComposeComponent, title: 'Compose' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComposeRoutingModule {}
