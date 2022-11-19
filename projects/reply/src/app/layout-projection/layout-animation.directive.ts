import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, Input, OnInit, Self } from '@angular/core';
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
  LayoutProjectionLayout,
  LayoutProjectionNode,
} from './core/layout-projection';

@Directive({
  selector:
    '[rplLayoutProjectionNode][rplLayoutAnimation],[rplLayoutProjectionNode][animateLayoutOn]',
})
export class LayoutAnimationDirective implements OnInit {
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

  @Input() animationTimings: string | number = '225ms ease-in-out';

  private layoutSnapshots = new WeakMap<
    LayoutProjectionNode,
    LayoutProjectionLayout
  >();

  constructor(
    @Self() private node: LayoutProjectionNode,
    private animationBuilder: AnimationBuilder,
  ) {}

  ngOnInit(): void {
    const domWillUpdate$ = this.animateLayoutOn$.pipe(exhaustAll(), skip(1));

    domWillUpdate$
      .pipe(
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
      )
      .subscribe(() => {
        this.project();
        this.animate();
      });
  }

  snapshot(): void {
    this.node.traverse((node) => {
      this.layoutSnapshots.set(node, node.element.getBoundingClientRect());
    });
  }

  project(): void {
    this.node.measure();

    this.node.traverse((node) => {
      const snapshot = this.layoutSnapshots.get(node);
      if (!snapshot) return;
      node.calculate(snapshot);
    });

    this.node.project();
  }

  animate(): void {
    this.node.traverse((node) => {
      const animationPlayer = this.animationBuilder
        .build([animate(this.animationTimings, style({ transform: 'none' }))])
        .create(node.element);
      animationPlayer.play();
      animationPlayer.onDone(() => {
        node.element.style.transform = '';
        animationPlayer.destroy();
      });
    });
  }
}
