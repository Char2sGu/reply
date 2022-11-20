import {
  LayoutBorderRadius,
  LayoutBorderRadiuses,
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
  boundingBoxTransform?: LayoutBoundingBoxTransform;

  borderRadiuses?: LayoutBorderRadiuses;

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
    if (!this.parent) throw new Error('Missing parent');
    this.parent.children.delete(this);
    this.parent = undefined;
  }

  traverse(callback: (node: LayoutProjectionNode) => void): void {
    callback(this);
    this.children.forEach((child) => child.traverse(callback));
  }

  reset(): void {
    this.element.style.transform = '';
    this.element.style.borderRadius = '';
  }

  measure(): void {
    this.reset();

    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    this.children.forEach((child) => child.measure());

    this.boundingBox = this.measurer.measureBoundingBox(this.element);
    this.borderRadiuses = this.measurer.measureBorderRadiuses(
      this.element,
      this.boundingBox,
    );
  }

  calculate(destBoundingBox: LayoutBoundingBox): void {
    if (!this.boundingBox) throw new Error('Missing bounding box');

    const currBoundingBox = this.calibrate(this.boundingBox);
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

  calibrate(boundingBox: LayoutBoundingBox): LayoutBoundingBox {
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

    return boundingBox;

    function calibratePoint(
      point: number,
      { origin, scale, translate }: LayoutBoundingBoxAxisTransform,
    ) {
      const distanceFromOrigin = point - origin;
      const scaled = origin + distanceFromOrigin * scale;
      const translated = scaled + translate * scale;
      return translated;
    }
  }

  project(): void {
    if (!this.boundingBoxTransform) throw new Error('Missing transform');
    if (!this.borderRadiuses) throw new Error('Missing border radiuses');

    const ancestorTotalScale = { x: 1, y: 1 };
    const ancestors = this.getAncestors();
    for (const ancestor of ancestors) {
      if (!ancestor.boundingBoxTransform) continue;
      ancestorTotalScale.x *= ancestor.boundingBoxTransform.x.scale;
      ancestorTotalScale.y *= ancestor.boundingBoxTransform.y.scale;
    }

    const style = this.element.style;

    const transform = this.boundingBoxTransform;
    const translateX = transform.x.translate / ancestorTotalScale.x;
    const translateY = transform.y.translate / ancestorTotalScale.y;
    style.transform = [
      `translate3d(${translateX}px, ${translateY}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    const totalScale = {
      x: ancestorTotalScale.x * this.boundingBoxTransform.x.scale,
      y: ancestorTotalScale.y * this.boundingBoxTransform.y.scale,
    };

    const radiuses = this.borderRadiuses;
    const radiusStyle = (radius: LayoutBorderRadius) =>
      `${radius.x / totalScale.x}px ${radius.y / totalScale.y}px`;
    style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);

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
