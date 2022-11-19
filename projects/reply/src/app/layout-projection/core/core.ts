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

export interface LayoutBoundingBoxAxisTransform {
  origin: number;
  scale: number;
  translate: number;
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
