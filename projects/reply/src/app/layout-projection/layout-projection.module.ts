import { NgModule } from '@angular/core';

import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [LayoutProjectionNodeDirective],
  exports: [LayoutProjectionNodeDirective],
})
export class LayoutProjectionModule {}
