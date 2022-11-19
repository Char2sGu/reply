import {
  LayoutBoundingBox,
  LayoutBoundingBoxAxisTransform,
  LayoutBoundingBoxTransform,
} from './core';
import { LayoutMeasurer } from './layout-measurement';

/**
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export class LayoutProjectionNode {
  static idNext = 1;

  id = LayoutProjectionNode.idNext++;

  boundingBox?: LayoutBoundingBox;
  boundingBoxCalibrated?: LayoutBoundingBox;
  boundingBoxTransform?: LayoutBoundingBoxTransform;

  parent?: LayoutProjectionNode;
  children = new Set<LayoutProjectionNode>();

  constructor(
    public element: HTMLElement,
    protected measurer: LayoutMeasurer,
  ) {}

  attach(parent: LayoutProjectionNode): void {
    this.parent = parent;
    parent.children.add(this);
  }

  detach(): void {
    if (!this.parent) throw new Error('Parent not found');
    this.parent.children.delete(this);
    this.parent = undefined;
  }

  traverse(callback: (node: LayoutProjectionNode) => void): void {
    callback(this);
    this.children.forEach((child) => child.traverse(callback));
  }

  measure(): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    this.element.style.transform = '';
    this.children.forEach((child) => child.measure());
    this.boundingBox = this.measurer.measureBoundingBox(this.element);
  }

  calculate(destBoundingBox: LayoutBoundingBox): void {
    this.calibrate();
    if (!this.boundingBoxCalibrated)
      throw new Error('Missing calibrated bounding box');
    const currBoundingBox = this.boundingBoxCalibrated;
    const currMidpoint = currBoundingBox.midpoint();
    const destMidpoint = destBoundingBox.midpoint();
    this.boundingBoxTransform = {
      x: {
        origin: currMidpoint.x,
        scale: destBoundingBox.width() / currBoundingBox.width(),
        translate: destMidpoint.x - currMidpoint.x,
      },
      y: {
        origin: destMidpoint.y,
        scale: destBoundingBox.height() / currBoundingBox.height(),
        translate: destMidpoint.y - currMidpoint.y,
      },
    };
  }

  calibrate(): void {
    if (!this.boundingBox) throw new Error('Missing bounding box');

    let boundingBox = this.boundingBox;
    for (const ancestor of this.getAncestors()) {
      if (!ancestor.boundingBox || !ancestor.boundingBoxTransform) continue;
      const transform = ancestor.boundingBoxTransform;
      boundingBox = new LayoutBoundingBox({
        top: calibratePoint(boundingBox.top, transform.y),
        left: calibratePoint(boundingBox.left, transform.x),
        right: calibratePoint(boundingBox.right, transform.x),
        bottom: calibratePoint(boundingBox.bottom, transform.y),
      });
    }

    this.boundingBoxCalibrated = boundingBox;

    function calibratePoint(
      point: number,
      { origin, scale, translate }: LayoutBoundingBoxAxisTransform,
    ) {
      const distanceFromOrigin = point - origin;
      const scaled = origin + distanceFromOrigin * scale;
      const translated = scaled + translate;
      return translated;
    }
  }

  project(): void {
    if (!this.boundingBoxTransform) throw new Error('Transform not found');

    const ancestorTotalScale = { x: 1, y: 1 };
    const ancestors = this.getAncestors();
    for (const ancestor of ancestors) {
      if (!ancestor.boundingBoxTransform) continue;
      ancestorTotalScale.x *= ancestor.boundingBoxTransform.x.scale;
      ancestorTotalScale.y *= ancestor.boundingBoxTransform.y.scale;
    }

    const transform = this.boundingBoxTransform;
    const translateX = transform.x.translate / ancestorTotalScale.x;
    const translateY = transform.y.translate / ancestorTotalScale.y;
    this.element.style.transform = [
      `translate3d(${translateX}px, ${translateY}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    this.children.forEach((child) => child.project());
  }

  protected getAncestors(): LayoutProjectionNode[] {
    const ancestors = [];
    let ancestor = this.parent;
    while (ancestor) {
      ancestors.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return ancestors;
  }
}
