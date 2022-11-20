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
  LayoutBorderRadius,
  LayoutBorderRadiuses,
  LayoutBoundingBox,
} from './core';
import { LayoutMeasurer } from './layout-measurement';
import { LayoutProjectionNode } from './layout-projection';

export class LayoutAnimator {
  protected boundingBoxSnapshots = new NodeBoundingBoxWeakMap();
  protected borderRadiusesSnapshots = new NodeBorderRadiusesWeakMap();
  protected animatingStopper?: () => void;

  constructor(
    public root: LayoutProjectionNode,
    protected measurer: LayoutMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  snapshot(): void {
    this.root.traverse((node) => {
      const boundingBox = this.measurer.measureBoundingBox(node.element);
      const borderRadiuses = this.measurer.measureBorderRadiuses(
        node.element,
        boundingBox,
      );
      this.boundingBoxSnapshots.set(node, boundingBox);
      this.borderRadiusesSnapshots.set(node, borderRadiuses);
    });
  }

  animate(duration: number, easing: string | Easing): void {
    if (this.animatingStopper) {
      this.animatingStopper();
      this.animatingStopper = undefined;
    }

    const animationContextMap = this.getAnimationContextMap();

    const projectFrame = (progress: number) =>
      this.projectFrame(animationContextMap, progress);

    projectFrame(0);

    const { stop } = animate({
      from: 0,
      to: 1,
      duration,
      ease: this.easingParser.coerceEasing(easing),
      onUpdate: projectFrame,
    });
    this.animatingStopper = stop;
  }

  protected projectFrame(
    configMap: NodeAnimationContextWeakMap,
    progress: number,
  ): void {
    this.root.traverse((node) => {
      const context = configMap.get(node);
      if (!context) throw new Error('Unknown node');
      const boundingBox = this.getFrameBoundingBox(context, progress);
      const borderRadiuses = this.getFrameBorderRadiuses(context, progress);
      node.calculate(boundingBox);
      node.borderRadiuses = borderRadiuses;
    });

    this.root.project();
  }

  protected getAnimationContextMap(): NodeAnimationContextWeakMap {
    this.root.measure();

    const map = new NodeAnimationContextWeakMap();

    this.root.traverse((node) => {
      if (!node.boundingBox || !node.borderRadiuses)
        throw new Error('Unknown node');

      const boundingBoxSnapshot = this.boundingBoxSnapshots.get(node);
      this.boundingBoxSnapshots.delete(node);
      const boundingBoxSource =
        boundingBoxSnapshot ?? this.measurer.measureBoundingBox(node.element);
      const boundingBoxDest = node.boundingBox;

      const borderRadiusesSnapshot = this.borderRadiusesSnapshots.get(node);
      this.borderRadiusesSnapshots.delete(node);
      const borderRadiusesSource =
        borderRadiusesSnapshot ??
        this.measurer.measureBorderRadiuses(node.element, node.boundingBox);
      const borderRadiusesDest = node.borderRadiuses;

      map.set(node, {
        boundingBoxSource,
        boundingBoxDest,
        borderRadiusesSource,
        borderRadiusesDest,
      });
    });

    return map;
  }

  protected getFrameBoundingBox(
    context: NodeAnimationContext,
    progress: number,
  ): LayoutBoundingBox {
    const source = context.boundingBoxSource;
    const dest = context.boundingBoxDest;
    return new LayoutBoundingBox({
      top: mix(source.top, dest.top, progress),
      left: mix(source.left, dest.left, progress),
      right: mix(source.right, dest.right, progress),
      bottom: mix(source.bottom, dest.bottom, progress),
    });
  }

  protected getFrameBorderRadiuses(
    context: NodeAnimationContext,
    progress: number,
  ): LayoutBorderRadiuses {
    const source = context.borderRadiusesSource;
    const dest = context.borderRadiusesDest;

    const mixRadius = (
      source: LayoutBorderRadius,
      dest: LayoutBorderRadius,
      progress: number,
    ): LayoutBorderRadius => ({
      x: mix(source.x, dest.x, progress),
      y: mix(source.y, dest.y, progress),
    });

    return {
      topLeft: mixRadius(source.topLeft, dest.topLeft, progress),
      topRight: mixRadius(source.topRight, dest.topRight, progress),
      bottomLeft: mixRadius(source.bottomLeft, dest.bottomLeft, progress),
      bottomRight: mixRadius(source.bottomRight, dest.bottomRight, progress),
    };
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

class NodeBorderRadiusesWeakMap extends WeakMap<
  LayoutProjectionNode,
  LayoutBorderRadiuses
> {}

class NodeAnimationContextWeakMap extends WeakMap<
  LayoutProjectionNode,
  NodeAnimationContext
> {}

interface NodeAnimationContext {
  boundingBoxSource: LayoutBoundingBox;
  boundingBoxDest: LayoutBoundingBox;
  borderRadiusesSource: LayoutBorderRadiuses;
  borderRadiusesDest: LayoutBorderRadiuses;
}
