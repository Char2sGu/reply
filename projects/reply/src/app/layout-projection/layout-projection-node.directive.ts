import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';

import { LayoutProjectionNode } from './core/core';

@Directive({
  selector: '[rplLayoutProjectionNode]',
})
export class LayoutProjectionNodeDirective
  extends LayoutProjectionNode
  implements OnInit, OnDestroy
{
  @Input('rplLayoutProjectionNode') key?: string;

  private destroy$ = new EventEmitter();

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Optional() @SkipSelf() parent: LayoutProjectionNodeDirective,
  ) {
    super(elementRef.nativeElement, parent);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
