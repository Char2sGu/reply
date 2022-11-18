import { Directive, ElementRef, OnDestroy, SkipSelf } from '@angular/core';

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
    @SkipSelf() parent: LayoutProjectionNode,
  ) {
    super(elementRef.nativeElement);
    this.attach(parent);
  }

  ngOnDestroy(): void {
    this.detach();
  }
}
