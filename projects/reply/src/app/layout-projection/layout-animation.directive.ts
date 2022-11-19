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

  @Input() animationDuration: number = 225;
  @Input() animationEasing: string = 'ease-in-out';

  private layoutSnapshots = new NodeLayoutWeakMap();

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
      const snapshot = LayoutProjectionLayout.measure(node.element);
      this.layoutSnapshots.set(node, snapshot);
    });
  }

  animate(): void {
    this.node.measure();

    const destLayoutMap = new NodeLayoutWeakMap();
    this.node.traverse((node) => {
      const snapshot = this.layoutSnapshots.get(node);
      this.layoutSnapshots.delete(node);
      const destLayout =
        snapshot ?? LayoutProjectionLayout.measure(node.element);
      destLayoutMap.set(node, destLayout);
    });

    const project = (progress: number) => this.project(destLayoutMap, progress);

    project(0);
    animate({
      from: 0,
      to: 1,
      duration: this.animationDuration,
      ease: parseEasing(this.animationEasing),
      onUpdate: project,
    });
  }

  project(destLayouts: NodeLayoutWeakMap, progress: number): void {
    this.node.traverse((node) => {
      const sourceLayout = node.layout;
      const destLayout = destLayouts.get(node);
      if (!sourceLayout || !destLayout) throw new Error('Unknown node');

      const frameTargetLayout = new LayoutProjectionLayout({
        top: mix(destLayout.top, sourceLayout.top, progress),
        left: mix(destLayout.left, sourceLayout.left, progress),
        right: mix(destLayout.right, sourceLayout.right, progress),
        bottom: mix(destLayout.bottom, sourceLayout.bottom, progress),
      });

      node.calculate(frameTargetLayout);
    });

    this.node.project();
  }
}

class NodeLayoutWeakMap extends WeakMap<
  LayoutProjectionNode,
  LayoutProjectionLayout
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
