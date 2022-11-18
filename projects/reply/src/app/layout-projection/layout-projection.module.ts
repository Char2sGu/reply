import { NgModule } from '@angular/core';

import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';
import { LayoutProjectionRootDirective } from './layout-projection-root.directive';

@NgModule({
  declarations: [
    LayoutProjectionRootDirective,
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
  ],
  exports: [
    LayoutProjectionRootDirective,
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
  ],
})
export class LayoutProjectionModule {}
