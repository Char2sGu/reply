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
import { inject } from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ChildrenOutletContexts } from '@angular/router';

export function injectAnimationIdFactory(): () => string {
  const contexts = inject(ChildrenOutletContexts);
  return () =>
    contexts.getContext('primary')?.route?.snapshot?.data?.['animationId'] ??
    'none';
}

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
  // eslint-disable-next-line max-lines-per-function
  static override apply(
    axis: 'x' | 'y' | 'z',
    mode: 'forward' | 'backward',
    selectors = { incoming: ':enter', outgoing: ':leave' },
  ): AnimationAnimateRefMetadata {
    const params =
      axis === 'x'
        ? {
            overflowX: 'visible',
            overflowY: '*',
            transformIncomingFrom: `translateX(30px)`,
            transformIncomingTo: `translateX(0)`,
            transformOutgoingFrom: `translateX(0)`,
            transformOutgoingTo: `translateX(-30px)`,
          }
        : axis === 'y'
        ? {
            overflowX: '*',
            overflowY: 'visible',
            transformIncomingFrom: `translateY(30px)`,
            transformIncomingTo: `translateY(0)`,
            transformOutgoingFrom: `translateY(0)`,
            transformOutgoingTo: `translateY(-30px)`,
          }
        : {
            overflowX: 'visible',
            overflowY: 'visible',
            transformIncomingFrom: `scale(80%)`,
            transformIncomingTo: `scale(100%)`,
            transformOutgoingFrom: `scale(100%)`,
            transformOutgoingTo: `scale(110%)`,
          };

    if (mode === 'backward')
      [
        params.transformIncomingFrom,
        params.transformIncomingTo,
        params.transformOutgoingFrom,
        params.transformOutgoingTo,
      ] = [
        params.transformOutgoingTo,
        params.transformOutgoingFrom,
        params.transformIncomingTo,
        params.transformIncomingFrom,
      ];

    return useAnimation(
      animation([
        MaterialPatchesAnimation.apply(),
        group([
          query(selectors.outgoing, [
            style({ transform: params.transformOutgoingFrom }),
            animate(
              `300ms ${AnimationCurves.STANDARD_CURVE}`,
              style({ transform: params.transformOutgoingTo }),
            ),
          ]),
          query(selectors.incoming, [
            style({ transform: params.transformIncomingFrom }),
            animate(
              `300ms ${AnimationCurves.STANDARD_CURVE}`,
              style({ transform: params.transformIncomingTo }),
            ),
          ]),
          query(selectors.outgoing, [
            PreserveChildRoutesAnimation.apply(),
            animate(
              `90ms ${AnimationCurves.ACCELERATION_CURVE}`,
              style({ opacity: 0 }),
            ),
          ]),
          query(selectors.incoming, [
            style({ opacity: 0 }),
            animate(
              `210ms 90ms ${AnimationCurves.DECELERATION_CURVE}`,
              style({ opacity: 1 }),
            ),
          ]),
        ]),
      ]),
    );
  }
}
