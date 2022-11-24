import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';

import { LayoutMeasurer, LayoutProjectionNode } from './core';

@Directive({
  selector: '[libLayoutProjectionNode]',
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
  @Input() set libLayoutProjectionNode(v: string | false) {
    if (typeof v === 'string') {
      if (v) this.identifyAs(v);
      this.activate();
    } else {
      this.deactivate();
    }
  }

  constructor(
    elementRef: ElementRef<HTMLElement>,
    measurer: LayoutMeasurer,
    @SkipSelf() @Optional() parent?: LayoutProjectionNode,
  ) {
    super(elementRef.nativeElement, measurer);
    if (parent) this.attach(parent);
  }

  ngOnDestroy(): void {
    if (this.parent) this.detach();
  }
}
