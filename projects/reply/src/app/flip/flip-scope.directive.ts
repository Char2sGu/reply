import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import FlipController from 'flipping/lib/adapters/web';
import { FlippingWebOptions } from 'flipping/lib/types';
import { filter, takeUntil, tap } from 'rxjs';

import { FlipItemDirective } from './flip-item.directive';

@Directive({
  selector: '[rplFlipScope]',
})
export class FlipScopeDirective implements OnInit, OnDestroy {
  @Input('rplFlipScope') config: FlipScopeConfig = {};

  @Input() set autoFlipOn(value: unknown) {
    this.autoFlip = true;
  }
  private autoFlip = false;

  items = new Map<FlipItemDirective, HTMLElement>();

  private flipController!: FlipController;
  private destroy$ = new EventEmitter();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.flipController = new FlipController({
      parent: this.elementRef.nativeElement,
      selector: () => [...this.items.values()],
      ...this.config,
    });
    // FLIP must be triggered after the DOM is updated and before it is
    // rendered. NgZone seems to be the only choice for the requirement.
    this.ngZone.onStable
      .pipe(
        filter(() => this.autoFlip),
        tap(() => (this.autoFlip = false)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.flip());
  }
  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  save(): void {
    this.flipController.read();
  }
  flip(): void {
    this.flipController.flip();
  }
}

export interface FlipScopeConfig
  extends Pick<FlippingWebOptions, 'duration' | 'easing'> {}
