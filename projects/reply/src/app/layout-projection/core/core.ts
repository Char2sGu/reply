/**
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export class LayoutProjectionNode {
  static idNext = 1;

  id = LayoutProjectionNode.idNext++;
  layout?: LayoutProjectionLayout;
  transform?: LayoutProjectionTransform;
  children = new Set<LayoutProjectionNode>();

  private ancestors?: LayoutProjectionNode[];

  constructor(
    public element: HTMLElement,
    public parent?: LayoutProjectionNode,
  ) {
    if (parent) parent.children.add(this);
  }

  measure(): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    this.element.style.transform = '';
    this.children.forEach((child) => child.measure());
    this.layout = LayoutProjectionLayout.from(
      this.element.getBoundingClientRect(),
    );
  }

  calculate(targetLayout: LayoutProjectionLayout): void {
    if (!this.layout) throw new Error('Layout not found');
    this.calibrate();
    const originX = mix(this.layout.left, this.layout.right, 0.5);
    const originY = mix(this.layout.top, this.layout.bottom, 0.5);
    const targetOriginX = mix(targetLayout.left, targetLayout.right, 0.5);
    const targetOriginY = mix(targetLayout.top, targetLayout.bottom, 0.5);
    const scaleX = targetLayout.width / this.layout.width;
    const scaleY = targetLayout.height / this.layout.height;
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
      if (!ancestor.transform)
        throw new Error('Transform not found on ancestor');
      const calibrated = {
        width: this.layout.width * ancestor.transform.x.scale,
        height: this.layout.height * ancestor.transform.y.scale,
        top: calibratePoint(this.layout.top, ancestor.transform.y),
        left: calibratePoint(this.layout.left, ancestor.transform.x),
        right: calibratePoint(this.layout.right, ancestor.transform.x),
        bottom: calibratePoint(this.layout.bottom, ancestor.transform.y),
      };
      this.layout = LayoutProjectionLayout.from({
        ...calibrated,
        x: calibrated.left,
        y: calibrated.top,
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
      if (!ancestor.transform)
        throw new Error('Transform not found on ancestor');
      ancestorTotalScale.x *= ancestor.transform.x.scale;
      ancestorTotalScale.y *= ancestor.transform.y.scale;
    }

    const translateX = this.transform.x.translate / ancestorTotalScale.x;
    const translateY = this.transform.y.translate / ancestorTotalScale.y;
    this.element.style.transform = `
translate3d(${translateX}px, ${translateY}px, 0)
scale(${this.transform.x.scale}, ${this.transform.y.scale})
`
      .trim()
      .replace('\n', ' ');

    this.children.forEach((child) => child.project());
  }

  private getAncestors(): LayoutProjectionNode[] {
    if (this.ancestors) return this.ancestors;
    this.ancestors = [];
    let ancestor = this.parent;
    while (ancestor) {
      this.ancestors.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return this.ancestors;
  }
}

export class LayoutProjectionLayout implements Omit<DOMRect, 'toJSON'> {
  static from(data: LayoutProjectionLayout): LayoutProjectionLayout {
    const layout = new LayoutProjectionLayout();
    layout.width = data.width;
    layout.height = data.height;
    layout.top = data.top;
    layout.left = data.left;
    layout.right = data.right;
    layout.bottom = data.bottom;
    layout.x = data.x;
    layout.y = data.y;
    return layout;
  }

  width!: number;
  height!: number;
  top!: number;
  left!: number;
  right!: number;
  bottom!: number;
  x!: number;
  y!: number;
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
