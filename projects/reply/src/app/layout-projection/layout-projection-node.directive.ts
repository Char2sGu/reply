import {
  Directive,
  ElementRef,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';

import { LayoutProjectionNode } from './core/layout-projection';

@Directive({
  selector: '[rplLayoutProjectionNode]',
  providers: [
    {
      provide: LayoutProjectionNode,
      useExisting: LayoutProjectionNodeDirective,
    },
  ],
})
export class LayoutProjectionNodeDirective
  extends LayoutProjectionNode
  implements OnDestroy
{
  constructor(
    elementRef: ElementRef<HTMLElement>,
    @SkipSelf() @Optional() parent?: LayoutProjectionNode,
  ) {
    super(elementRef.nativeElement);
    if (parent) this.attach(parent);
  }

  ngOnDestroy(): void {
    if (this.parent) this.detach();
  }
}
