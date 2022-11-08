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
  selector: '[libFlipScope]',
})
export class FlipScopeDirective implements OnInit, OnDestroy {
  @Input('libFlipScope') config?: FlipScopeConfig = {};

  @Input() set flipOn(value: unknown) {
    if (!this.initialized) return;
    this.flipOnNextEvent = true;
    this.save();
  }

  items = new Map<FlipItemDirective, HTMLElement>();

  private initialized = false;
  private flipController!: FlipController;
  private flipOnNextEvent = false;
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
        filter(() => this.flipOnNextEvent),
        tap(() => (this.flipOnNextEvent = false)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.flip());

    this.initialized = true;
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
