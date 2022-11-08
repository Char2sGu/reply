import {
  Directive,
  ElementRef,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { FlipScopeDirective } from './flip-scope.directive';

@Directive({
  selector: '[rplFlipItem]',
})
export class FlipItemDirective implements OnInit, OnDestroy {
  @Input('rplFlipItem') @HostBinding('attr.data-flip-key') key =
    this.getDefaultKey();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Host() private scope: FlipScopeDirective,
  ) {}

  ngOnInit(): void {
    this.scope.items.set(this, this.elementRef.nativeElement);
  }
  ngOnDestroy(): void {
    this.scope.items.delete(this);
  }

  private getDefaultKey(): string {
    return `anonymous-${new Date().getTime()}`;
  }
}
