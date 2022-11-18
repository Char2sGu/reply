import { Directive, ElementRef } from '@angular/core';

import { LayoutProjectionNode } from './core/layout-projection';

@Directive({
  selector: '[rplLayoutProjectionRoot]',
  providers: [
    {
      provide: LayoutProjectionNode,
      useExisting: LayoutProjectionRootDirective,
    },
  ],
})
export class LayoutProjectionRootDirective extends LayoutProjectionNode {
  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef.nativeElement);
  }
}
