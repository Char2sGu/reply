import {
  animate,
  animation,
  AnimationAnimateRefMetadata,
  AnimationReferenceMetadata,
  group,
  query,
  style,
  useAnimation,
} from '@angular/animations';
import { AnimationCurves } from '@angular/material/core';

export abstract class Animation {
  static readonly content: AnimationReferenceMetadata;

  static apply(...args: unknown[]): AnimationAnimateRefMetadata {
    return useAnimation(this.content);
  }
}

/**
 * Fix Angular Material's animation issues.
 */
export class MaterialPatchesAnimation extends Animation {
  static override content: AnimationReferenceMetadata = animation([
    // mat-drawer's styles break after its `ngOnDestroy` is called
    query('mat-drawer', style({ transform: 'none' }), { optional: true }),
  ]);
}

/**
 * Prevent child routes from bering removed.
 * @see https://github.com/angular/angular/issues/15477#issuecomment-377619882
 */
export class PreserveChildRoutesAnimation extends Animation {
  static override content: AnimationReferenceMetadata = animation([
    query('router-outlet ~ *', [animate('1ms', style({}))], { optional: true }),
  ]);
}

/**
 * @see https://material.io/design/motion/the-motion-system.html#fade-through
 */
export class FadeThroughAnimation extends Animation {
  static override content: AnimationReferenceMetadata = animation([
    MaterialPatchesAnimation.apply(),
    group([
      query(
        ':leave',
        [
          style({ position: 'absolute' }),
          PreserveChildRoutesAnimation.apply(),
          style({ opacity: 1 }),
          animate(
            `90ms ${AnimationCurves.ACCELERATION_CURVE}`,
            style({ opacity: 0 }),
          ),
        ],
        { optional: true },
      ),
      query(':enter', [
        style({ transform: 'scale(92%)', opacity: 0 }),
        animate(
          `210ms 90ms ${AnimationCurves.DECELERATION_CURVE}`,
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
      ]),
    ]),
  ]);
}

/**
 * @see https://material.io/design/motion/the-motion-system.html#shared-axis
 */
export class SharedAxisAnimation extends Animation {
  static override content: AnimationReferenceMetadata = animation([
    MaterialPatchesAnimation.apply(),
    style({
      position: 'relative',
      width: '*',
      height: '*',
      overflowX: '{{ overflowX }}',
      overflowY: '{{ overflowY }}',
    }),
    query(
      ':enter, :leave',
      style({ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }),
    ),
    group([
      query(':leave', [
        PreserveChildRoutesAnimation.apply(),
        animate(
          `90ms ${AnimationCurves.ACCELERATION_CURVE}`,
          style({ opacity: 0 }),
        ),
      ]),
      query(':enter', [
        style({ opacity: 0 }),
        animate(
          `210ms 90ms ${AnimationCurves.DECELERATION_CURVE}`,
          style({ opacity: 1 }),
        ),
      ]),
      query(':leave', [
        style({ transform: '{{ transformOutgoingFrom }}' }),
        animate(
          `300ms ${AnimationCurves.STANDARD_CURVE}`,
          style({
            transform: `{{ transformOutgoingTo }}`,
          }),
        ),
      ]),
      query(':enter', [
        style({
          transform: `{{ transformIncomingFrom }}`,
        }),
        animate(
          `300ms ${AnimationCurves.STANDARD_CURVE}`,
          style({ transform: '{{ transformIncomingTo }}' }),
        ),
      ]),
    ]),
  ]);

  // eslint-disable-next-line max-lines-per-function
  static override apply(
    axis: 'x' | 'y' | 'z',
    mode: 'forward' | 'backward',
  ): AnimationAnimateRefMetadata {
    const getParams = ({
      transformIncomingFrom,
      transformIncomingTo,
      transformOutgoingFrom,
      transformOutgoingTo,
      ...params
    }: Record<string, string>) =>
      mode === 'forward'
        ? {
            transformIncomingFrom,
            transformIncomingTo,
            transformOutgoingFrom,
            transformOutgoingTo,
            ...params,
          }
        : {
            transformIncomingFrom: transformOutgoingTo,
            transformIncomingTo: transformOutgoingFrom,
            transformOutgoingFrom: transformIncomingTo,
            transformOutgoingTo: transformIncomingFrom,
            ...params,
          };
    const params =
      axis === 'x'
        ? getParams({
            overflowX: 'hidden',
            overflowY: '*',
            transformIncomingFrom: `translateX(30px)`,
            transformIncomingTo: `translateX(0)`,
            transformOutgoingFrom: `translateX(0)`,
            transformOutgoingTo: `translateX(-30px)`,
          })
        : axis === 'y'
        ? getParams({
            overflowX: '*',
            overflowY: 'hidden',
            transformIncomingFrom: `translateY(30px)`,
            transformIncomingTo: `translateY(0)`,
            transformOutgoingFrom: `translateY(0)`,
            transformOutgoingTo: `translateY(-30px)`,
          })
        : getParams({
            overflowX: 'hidden',
            overflowY: 'hidden',
            transformIncomingFrom: `scale(80%)`,
            transformIncomingTo: `scale(100%)`,
            transformOutgoingFrom: `scale(100%)`,
            transformOutgoingTo: `scale(110%)`,
          });
    return useAnimation(this.content, { params });
  }
}
