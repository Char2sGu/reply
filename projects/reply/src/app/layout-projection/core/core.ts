import { mix } from 'popmotion';

export class LayoutBoundingBox {
  top: number;
  left: number;
  right: number;
  bottom: number;

  constructor(data: Omit<LayoutBoundingBox, 'width' | 'height' | 'midpoint'>) {
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

  midpoint(): { x: number; y: number } {
    return {
      x: mix(this.left, this.right, 0.5),
      y: mix(this.top, this.bottom, 0.5),
    };
  }
}

export interface LayoutBoundingBoxTransform {
  x: LayoutBoundingBoxAxisTransform;
  y: LayoutBoundingBoxAxisTransform;
}

export class LayoutBoundingBoxAxisTransform {
  origin: number;
  scale: number;
  translate: number;

  constructor(data: Omit<LayoutBoundingBoxAxisTransform, 'apply'>) {
    this.origin = data.origin;
    this.scale = data.scale;
    this.translate = data.translate;
  }

  apply(value: number): number {
    const distanceFromOrigin = value - this.origin;
    const scaled = this.origin + distanceFromOrigin * this.scale;
    const translated = scaled + this.translate * this.scale;
    return translated;
  }
}

export interface LayoutBorderRadiuses {
  topLeft: LayoutBorderRadius;
  topRight: LayoutBorderRadius;
  bottomLeft: LayoutBorderRadius;
  bottomRight: LayoutBorderRadius;
}

export interface LayoutBorderRadius {
  x: number;
  y: number;
}
