import { NgModule } from '@angular/core';

import { FlipItemDirective } from './flip-item.directive';
import { FlipScopeDirective } from './flip-scope.directive';

/**
 * Angular Adaption of Flipping.
 * @see https://aerotwist.com/blog/flip-your-animations/
 * @see https://css-tricks.com/animating-layouts-with-the-flip-technique/
 */
@NgModule({
  declarations: [FlipItemDirective, FlipScopeDirective],
  exports: [FlipItemDirective, FlipScopeDirective],
})
export class FlipModule {}
