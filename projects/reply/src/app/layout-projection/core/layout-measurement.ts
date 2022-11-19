import * as styleUnits from 'style-value-types';

import {
  LayoutBorderRadius,
  LayoutBorderRadiuses,
  LayoutBoundingBox,
} from './core';

export class LayoutMeasurer {
  constructor(protected borderRadiusParser: LayoutBorderRadiusParser) {}

  measureBoundingBox(element: HTMLElement): LayoutBoundingBox {
    return new LayoutBoundingBox(element.getBoundingClientRect());
  }

  measureBorderRadiuses(
    element: HTMLElement,
    boundingBox: LayoutBoundingBox = this.measureBoundingBox(element),
  ): LayoutBorderRadiuses {
    const style = getComputedStyle(element);

    const parse = (raw: string) =>
      this.borderRadiusParser.parseBorderRadius(
        raw,
        boundingBox.width(),
        boundingBox.height(),
      );

    return {
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    };
  }
}

export class LayoutBorderRadiusParser {
  parseBorderRadius(
    raw: string,
    width: number,
    height: number,
  ): LayoutBorderRadius {
    if (raw.match(/\d+(\.\d+)?% \d+(\.\d+)?%/u)) {
      const [x, y] = raw.split(' ').map((value) => parseFloat(value));
      return new LayoutBorderRadius(x, y);
    }
    if (styleUnits.percent.test(raw)) {
      const value = parseFloat(raw);
      return new LayoutBorderRadius(value, value);
    }
    if (styleUnits.px.test(raw)) {
      const value = parseFloat(raw);
      return new LayoutBorderRadius(
        (value / width) * 100,
        (value / height) * 100,
      );
    }
    throw new Error(`Unsupported radius: ${raw}`);
  }
}
