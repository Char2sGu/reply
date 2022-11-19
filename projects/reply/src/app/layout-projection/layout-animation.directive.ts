import { Directive, Input, OnInit, Self } from '@angular/core';
import { Easing } from 'popmotion';
import {
  animationFrames,
  BehaviorSubject,
  EMPTY,
  exhaustAll,
  first,
  Observable,
  of,
  skip,
  switchMap,
  tap,
} from 'rxjs';

import {
  LayoutAnimationEasingParser,
  LayoutAnimator,
} from './core/layout-animation';
import { LayoutMeasurer } from './core/layout-measurement';
import { LayoutProjectionNode } from './core/layout-projection';

@Directive({
  selector:
    '[rplLayoutProjectionNode][rplLayoutAnimation],[rplLayoutProjectionNode][animateLayoutOn]',
  providers: [
    { provide: LayoutAnimator, useExisting: LayoutAnimationDirective },
  ],
})
export class LayoutAnimationDirective extends LayoutAnimator implements OnInit {
  /**
   * Accepts:
   * - A stream that informs on view model updates where DOM updates that should
   * be animated will follow.
   * - An arbitrary value which will be set to another value before DOM updates.
   */
  @Input() set animateLayoutOn(value: unknown) {
    const stream = value instanceof Observable ? value : of(value);
    this.animateLayoutOn$.next(stream);
  }
  private animateLayoutOn$ = new BehaviorSubject<Observable<void>>(EMPTY);

  @Input() animationDuration: number = 225;
  @Input() animationEasing: string | Easing = 'ease-in-out';

  constructor(
    @Self() node: LayoutProjectionNode,
    measurer: LayoutMeasurer,
    easingParser: LayoutAnimationEasingParser,
  ) {
    super(node, measurer, easingParser);
  }

  ngOnInit(): void {
    const domWillUpdate$ = this.animateLayoutOn$.pipe(exhaustAll(), skip(1));

    domWillUpdate$
      .pipe(
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
      )
      .subscribe(() => this.animate());
  }

  override animate(
    duration: number = this.animationDuration,
    easing: string | Easing = this.animationEasing,
  ): void {
    super.animate(duration, easing);
  }
}
