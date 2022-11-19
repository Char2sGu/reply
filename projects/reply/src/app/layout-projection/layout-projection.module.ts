import { NgModule } from '@angular/core';

import { LayoutAnimationEasingParser } from './core/layout-animation';
import {
  LayoutBorderRadiusParser,
  LayoutMeasurer,
} from './core/layout-measurement';
import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  exports: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  providers: [
    LayoutAnimationEasingParser,
    {
      provide: LayoutMeasurer,
      useFactory: (...deps: ConstructorParameters<typeof LayoutMeasurer>) =>
        new LayoutMeasurer(...deps),
      deps: [LayoutBorderRadiusParser],
    },
    LayoutBorderRadiusParser,
  ],
})
export class LayoutProjectionModule {}
