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
  protected snapshots = new NodeLayoutSnapshotMap();
  protected animatingStopper?: () => void;

  constructor(
    public root: LayoutProjectionNode,
    protected measurer: LayoutMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  snapshot(): void {
    this.snapshots.clear();

    this.root.traverse(
      (node) => {
        const boundingBox = this.measurer.measureBoundingBox(node.element);
        const borderRadiuses = this.measurer.measureBorderRadiuses(
          node.element,
          boundingBox,
        );

        if (this.snapshots.has(node.id)) {
          const msg = `Multiple nodes with same id "${node.id}" belonging to a single layout animator`;
          throw new Error(msg);
        }

        this.snapshots.set(node.id, { boundingBox, borderRadiuses });
      },
      { includeSelf: true },
    );
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
    contextMap: NodeAnimationContextMap,
    progress: number,
  ): void {
    this.root.traverse(
      (node) => {
        const context = contextMap.get(node.id);
        if (!context) throw new Error('Unknown node');
        const boundingBox = this.getFrameBoundingBox(context, progress);
        const borderRadiuses = this.getFrameBorderRadiuses(context, progress);
        node.calculate(boundingBox);
        node.borderRadiuses = borderRadiuses;
      },
      { includeSelf: true },
    );

    this.root.project();
  }

  protected getAnimationContextMap(): NodeAnimationContextMap {
    this.root.measure();

    const map = new NodeAnimationContextMap();

    this.root.traverse(
      (node) => {
        if (!node.boundingBox || !node.borderRadiuses)
          throw new Error('Unknown node');

        const snapshot = this.snapshots.get(node.id);

        const boundingBoxFrom =
          snapshot?.boundingBox ??
          this.estimateStartingBoundingBox(node) ??
          node.boundingBox;
        const boundingBoxTo = node.boundingBox;

        const borderRadiusesFrom =
          snapshot?.borderRadiuses ??
          this.measurer.measureBorderRadiuses(node.element, node.boundingBox);
        const borderRadiusesTo = node.borderRadiuses;

        map.set(node.id, {
          boundingBoxFrom,
          boundingBoxTo,
          borderRadiusesFrom,
          borderRadiusesTo,
        });
      },
      { includeSelf: true },
    );

    return map;
  }

  protected getFrameBoundingBox(
    context: NodeAnimationContext,
    progress: number,
  ): LayoutBoundingBox {
    const from = context.boundingBoxFrom;
    const to = context.boundingBoxTo;
    return new LayoutBoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected getFrameBorderRadiuses(
    context: NodeAnimationContext,
    progress: number,
  ): LayoutBorderRadiuses {
    const from = context.borderRadiusesFrom;
    const to = context.borderRadiusesTo;

    const mixRadius = (
      from: LayoutBorderRadius,
      to: LayoutBorderRadius,
      progress: number,
    ): LayoutBorderRadius => ({
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    });

    return {
      topLeft: mixRadius(from.topLeft, to.topLeft, progress),
      topRight: mixRadius(from.topRight, to.topRight, progress),
      bottomLeft: mixRadius(from.bottomLeft, to.bottomLeft, progress),
      bottomRight: mixRadius(from.bottomRight, to.bottomRight, progress),
    };
  }

  protected estimateStartingBoundingBox(
    node: LayoutProjectionNode,
  ): LayoutBoundingBox | undefined {
    if (!node.boundingBox) throw new Error('Unknown node');

    let ancestor = node;
    let ancestorSnapshot: NodeLayoutSnapshot | undefined = undefined;
    while ((ancestorSnapshot = this.snapshots.get(ancestor.id)) === undefined) {
      if (!node.parent) return;
      ancestor = node.parent;
      if (ancestor === this.root) return;
    }
    if (!ancestor.boundingBox) throw new Error('Unknown ancestor');

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    ancestor.calculate(ancestorSnapshot.boundingBox);
    const transform = ancestor.boundingBoxTransform!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    const scale = transform.x.scale;

    return new LayoutBoundingBox({
      top:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.top) * scale,
      left:
        ancestorSnapshot.boundingBox.left -
        (ancestor.boundingBox.left - node.boundingBox.left) * scale,
      right:
        ancestorSnapshot.boundingBox.right -
        (ancestor.boundingBox.right - node.boundingBox.right) * scale,
      bottom:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.bottom) * scale,
    });
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

class NodeLayoutSnapshotMap extends Map<
  LayoutProjectionNode['id'],
  NodeLayoutSnapshot
> {}

interface NodeLayoutSnapshot {
  boundingBox: LayoutBoundingBox;
  borderRadiuses: LayoutBorderRadiuses;
}

class NodeAnimationContextMap extends Map<
  LayoutProjectionNode['id'],
  NodeAnimationContext
> {}

interface NodeAnimationContext {
  boundingBoxFrom: LayoutBoundingBox;
  boundingBoxTo: LayoutBoundingBox;
  borderRadiusesFrom: LayoutBorderRadiuses;
  borderRadiusesTo: LayoutBorderRadiuses;
}
