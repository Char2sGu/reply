import { NgModule } from '@angular/core';

import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';
import { LayoutProjectionRootDirective } from './layout-projection-root.directive';

@NgModule({
  declarations: [LayoutProjectionRootDirective, LayoutProjectionNodeDirective],
  exports: [LayoutProjectionRootDirective, LayoutProjectionNodeDirective],
})
export class LayoutProjectionModule {}
