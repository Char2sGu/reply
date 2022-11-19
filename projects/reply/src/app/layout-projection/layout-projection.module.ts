import { NgModule } from '@angular/core';

import { LayoutAnimationEasingParser } from './core/layout-animation';
import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  exports: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  providers: [LayoutAnimationEasingParser],
})
export class LayoutProjectionModule {}
