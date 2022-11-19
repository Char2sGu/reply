/**
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export class LayoutProjectionNode {
  static idNext = 1;

  id = LayoutProjectionNode.idNext++;

  layout?: LayoutProjectionLayout;
  transform?: LayoutProjectionTransform;

  parent?: LayoutProjectionNode;
  children = new Set<LayoutProjectionNode>();

  constructor(public element: HTMLElement) {}

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
    this.layout = LayoutProjectionLayout.measure(this.element);
  }

  calculate(targetLayout: LayoutProjectionLayout): void {
    if (!this.layout) throw new Error('Layout not found');
    this.calibrate();
    const originX = mix(this.layout.left, this.layout.right, 0.5);
    const originY = mix(this.layout.top, this.layout.bottom, 0.5);
    const targetOriginX = mix(targetLayout.left, targetLayout.right, 0.5);
    const targetOriginY = mix(targetLayout.top, targetLayout.bottom, 0.5);
    const scaleX = targetLayout.width() / this.layout.width();
    const scaleY = targetLayout.height() / this.layout.height();
    const translateX = targetOriginX - originX;
    const translateY = targetOriginY - originY;
    this.transform = {
      x: { origin: originX, scale: scaleX, translate: translateX },
      y: { origin: originY, scale: scaleY, translate: translateY },
    };
  }

  calibrate(): void {
    if (!this.layout) throw new Error('Layout not found');

    const ancestors = this.getAncestors();
    for (const ancestor of ancestors) {
      if (!ancestor.transform) continue;
      this.layout = new LayoutProjectionLayout({
        top: calibratePoint(this.layout.top, ancestor.transform.y),
        left: calibratePoint(this.layout.left, ancestor.transform.x),
        right: calibratePoint(this.layout.right, ancestor.transform.x),
        bottom: calibratePoint(this.layout.bottom, ancestor.transform.y),
      });
    }

    function calibratePoint(
      point: number,
      { origin, scale, translate }: LayoutProjectionTransformAxis,
    ) {
      const distanceFromOrigin = point - origin;
      const distanceFromOriginScaled = distanceFromOrigin * scale;
      const scaled = origin + distanceFromOriginScaled;
      const translated = scaled + translate;
      return translated;
    }
  }

  project(): void {
    if (!this.transform) throw new Error('Transform not found');

    const ancestorTotalScale = { x: 1, y: 1 };
    const ancestors = this.getAncestors();
    for (const ancestor of ancestors) {
      if (!ancestor.transform) continue;
      ancestorTotalScale.x *= ancestor.transform.x.scale;
      ancestorTotalScale.y *= ancestor.transform.y.scale;
    }

    const translateX = this.transform.x.translate / ancestorTotalScale.x;
    const translateY = this.transform.y.translate / ancestorTotalScale.y;
    this.element.style.transform = [
      `translate3d(${translateX}px, ${translateY}px, 0)`,
      `scale(${this.transform.x.scale}, ${this.transform.y.scale})`,
    ].join(' ');

    this.children.forEach((child) => child.project());
  }

  private getAncestors(): LayoutProjectionNode[] {
    const ancestors = [];
    let ancestor = this.parent;
    while (ancestor) {
      ancestors.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return ancestors;
  }
}

export class LayoutProjectionLayout {
  static measure(element: HTMLElement): LayoutProjectionLayout {
    return new this(element.getBoundingClientRect());
  }

  top!: number;
  left!: number;
  right!: number;
  bottom!: number;

  constructor(data: Omit<LayoutProjectionLayout, 'width' | 'height'>) {
    this.top = data.top;
    this.left = data.left;
    this.right = data.right;
    this.bottom = data.bottom;
  }

  width(): number {
    return this.right - this.left;
  }
  height(): number {
    return this.bottom - this.top;
  }
}

export interface LayoutProjectionTransform {
  x: LayoutProjectionTransformAxis;
  y: LayoutProjectionTransformAxis;
}

export interface LayoutProjectionTransformAxis {
  origin: number;
  scale: number;
  translate: number;
}

function mix(a: number, b: number, rate: number): number {
  return a + (b - a) * rate;
}
