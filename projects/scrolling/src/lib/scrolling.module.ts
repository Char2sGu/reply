import { ModuleWithProviders, NgModule } from '@angular/core';

import { ScrollDirectionDirective } from './scroll-direction.directive';
import { ScrollStateDirective } from './scroll-state.directive';
import { ScrollingModuleConfig } from './scrolling.module-config';

@NgModule({
  declarations: [ScrollDirectionDirective, ScrollStateDirective],
  exports: [ScrollDirectionDirective, ScrollStateDirective],
})
export class ScrollingModule {
  static forRoot(
    config = new ScrollingModuleConfig(),
  ): ModuleWithProviders<ScrollingModule> {
    return {
      ngModule: ScrollingModule,
      providers: [{ provide: ScrollingModuleConfig, useValue: config }],
    };
  }
}
