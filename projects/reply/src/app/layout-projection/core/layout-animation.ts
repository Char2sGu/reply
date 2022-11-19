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

import { LayoutBoundingBox } from './core';
import { LayoutMeasurer } from './layout-measurement';
import { LayoutProjectionNode } from './layout-projection';

export class LayoutAnimator {
  protected boundingBoxSnapshots = new NodeBoundingBoxWeakMap();

  constructor(
    public root: LayoutProjectionNode,
    protected measurer: LayoutMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  snapshot(): void {
    this.root.traverse((node) => {
      const snapshot = this.measurer.measureBoundingBox(node.element);
      this.boundingBoxSnapshots.set(node, snapshot);
    });
  }

  animate(duration: number, easing: string | Easing): void {
    this.root.measure();

    const destBoundingBoxMap = new NodeBoundingBoxWeakMap();
    this.root.traverse((node) => {
      const snapshot = this.boundingBoxSnapshots.get(node);
      this.boundingBoxSnapshots.delete(node);
      const dest = snapshot ?? this.measurer.measureBoundingBox(node.element);
      destBoundingBoxMap.set(node, dest);
    });

    const project = (progress: number) =>
      this.project(destBoundingBoxMap, progress);

    project(0);
    animate({
      from: 0,
      to: 1,
      duration,
      ease: this.easingParser.coerceEasing(easing),
      onUpdate: project,
    });
  }

  project(destBoundingBoxMap: NodeBoundingBoxWeakMap, progress: number): void {
    this.root.traverse((node) => {
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

    this.root.project();
  }
}

export class LayoutAnimationEasingParser {
  coerceEasing(raw: string | Easing): Easing {
    return typeof raw === 'string' ? this.parseEasing(raw) : raw;
  }

  parseEasing(easing: string): Easing {
    if (easing === 'linear') {
      return linear;
    } else if (easing === 'ease') {
      return easeInOut;
    } else if (easing === 'ease-in') {
      return easeIn;
    } else if (easing === 'ease-out') {
      return easeOut;
    } else if (easing === 'ease-in-out') {
      return easeInOut;
    } else if (easing.startsWith('cubic-bezier')) {
      const [a, b, c, d] = easing
        .replace('cubic-bezier(', '')
        .replace(')', '')
        .split(',')
        .map((v) => parseFloat(v));
      return cubicBezier(a, b, c, d);
    }
    throw new Error(`Unsupported easing string: ${easing}`);
  }
}

class NodeBoundingBoxWeakMap extends WeakMap<
  LayoutProjectionNode,
  LayoutBoundingBox
> {}
