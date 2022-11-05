import { NgModule } from '@angular/core';

import { ScrollDirectionDirective } from './scroll-direction.directive';
import { ScrollStateDirective } from './scroll-state.directive';

@NgModule({
  declarations: [ScrollDirectionDirective, ScrollStateDirective],
  exports: [ScrollDirectionDirective, ScrollStateDirective],
})
export class ScrollingModule {}
