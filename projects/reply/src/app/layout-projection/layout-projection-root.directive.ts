import { animate, AnimationBuilder, style } from '@angular/animations';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  animationFrames,
  BehaviorSubject,
  EMPTY,
  exhaustAll,
  first,
  Observable,
  skip,
  switchMap,
  tap,
} from 'rxjs';

import {
  LayoutProjectionLayout,
  LayoutProjectionNode,
} from './core/layout-projection';

@Directive({
  selector: '[rplLayoutProjectionRoot]',
  providers: [
    {
      provide: LayoutProjectionNode,
      useExisting: LayoutProjectionRootDirective,
    },
  ],
})
export class LayoutProjectionRootDirective
  extends LayoutProjectionNode
  implements OnInit, OnDestroy
{
  /**
   * A stream that informs on view model updates where DOM updates that should
   * be animated will follow.
   */
  // prettier-ignore
  @Input() set animateOn(stream: Observable<any>)
    { this.animateOn$.next(stream); }
  private animateOn$ = new BehaviorSubject<Observable<void>>(EMPTY);

  private destroy$ = new EventEmitter();

  private layoutSnapshots = new WeakMap<
    LayoutProjectionNode,
    LayoutProjectionLayout
  >();

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private animationBuilder: AnimationBuilder,
  ) {
    super(elementRef.nativeElement);
  }

  ngOnInit(): void {
    const domWillUpdate$ = this.animateOn$.pipe(exhaustAll(), skip(1));

    domWillUpdate$
      .pipe(
        tap(() => this.snapshotLayouts()),
        switchMap(() => animationFrames().pipe(first())),
      )
      .subscribe(() => {
        this.projectToSnapshots();
        this.animateToRemoveProjection();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  snapshotLayouts(): void {
    this.traverse((node) => {
      this.layoutSnapshots.set(node, node.element.getBoundingClientRect());
    });
  }

  projectToSnapshots(): void {
    this.measure();

    this.traverse((node) => {
      const snapshot = this.layoutSnapshots.get(node);
      if (!snapshot) return;
      node.calculate(snapshot);
    });

    this.project();
  }

  animateToRemoveProjection(): void {
    this.traverse((node) => {
      const animationPlayer = this.animationBuilder
        .build([animate('100ms', style({ transform: 'none' }))])
        .create(node.element);
      animationPlayer.play();
      animationPlayer.onDone(() => {
        node.element.style.transform = 'none';
        animationPlayer.destroy();
      });
    });
  }
}
