import { Directive, Input, OnInit, Self } from '@angular/core';
import {
  animate,
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  Easing,
  linear,
  mix,
} from 'popmotion';
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
  LayoutBoundingBox,
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

  @Input() animationDuration: number = 225;
  @Input() animationEasing: string = 'ease-in-out';

  private boundingBoxSnapshots = new NodeBoundingBoxWeakMap();

  constructor(@Self() private node: LayoutProjectionNode) {}

  ngOnInit(): void {
    const domWillUpdate$ = this.animateLayoutOn$.pipe(exhaustAll(), skip(1));

    domWillUpdate$
      .pipe(
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
      )
      .subscribe(() => this.animate());
  }

  snapshot(): void {
    this.node.traverse((node) => {
      const snapshot = LayoutBoundingBox.measure(node.element);
      this.boundingBoxSnapshots.set(node, snapshot);
    });
  }

  animate(): void {
    this.node.measure();

    const destBoundingBoxMap = new NodeBoundingBoxWeakMap();
    this.node.traverse((node) => {
      const snapshot = this.boundingBoxSnapshots.get(node);
      this.boundingBoxSnapshots.delete(node);
      const dest = snapshot ?? LayoutBoundingBox.measure(node.element);
      destBoundingBoxMap.set(node, dest);
    });

    const project = (progress: number) =>
      this.project(destBoundingBoxMap, progress);

    project(0);
    animate({
      from: 0,
      to: 1,
      duration: this.animationDuration,
      ease: parseEasing(this.animationEasing),
      onUpdate: project,
    });
  }

  project(destBoundingBoxMap: NodeBoundingBoxWeakMap, progress: number): void {
    this.node.traverse((node) => {
      const source = node.boundingBox;
      const dest = destBoundingBoxMap.get(node);
      if (!source || !dest) throw new Error('Unknown node');

      const frameDest = new LayoutBoundingBox({
        top: mix(dest.top, source.top, progress),
        left: mix(dest.left, source.left, progress),
        right: mix(dest.right, source.right, progress),
        bottom: mix(dest.bottom, source.bottom, progress),
      });

      node.calculate(frameDest);
    });

    this.node.project();
  }
}

class NodeBoundingBoxWeakMap extends WeakMap<
  LayoutProjectionNode,
  LayoutBoundingBox
> {}

function parseEasing(raw: string): Easing {
  if (raw === 'linear') {
    return linear;
  } else if (raw === 'ease') {
    return easeInOut;
  } else if (raw === 'ease-in') {
    return easeIn;
  } else if (raw === 'ease-out') {
    return easeOut;
  } else if (raw === 'ease-in-out') {
    return easeInOut;
  } else if (raw.startsWith('cubic-bezier')) {
    const [a, b, c, d] = raw
      .replace('cubic-bezier(', '')
      .replace(')', '')
      .split(',')
      .map((v) => parseFloat(v));
    return cubicBezier(a, b, c, d);
  }
  throw new Error(`Unsupported easing string: ${raw}`);
}
