import { animate, query, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { NavigationStart, Router } from '@angular/router';
import {
  LayoutAnimator,
  ProjectionNode,
  ProjectionNodeSnapper,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';
import { filter, takeUntil } from 'rxjs';

import { injectAnimationIdFactory } from '../core/animations';

// TODO: merge the two layouts into this component

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('route', [
      transition('list => detail', [query(':leave', [animate(500)])]), // preserve leaving element
      transition('detail => list', [query(':enter', [animate(1)])]), // block child :enter animation
    ]),
  ],
})
export class MailsComponent implements OnInit, AfterViewInit, OnDestroy {
  routeAnimationId = injectAnimationIdFactory();
  private router = inject(Router);
  private layoutAnimator = inject(LayoutAnimator);
  private layoutSnapper = inject(ProjectionNodeSnapper);

  @ViewChild(ProjectionNode) private layoutAnimationRoot!: ProjectionNode;
  private layoutAnimationSnapshots = new ProjectionNodeSnapshotMap();

  private destroy$ = new EventEmitter();

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        this.layoutAnimationSnapshots.merge(
          this.layoutSnapper.snapshotTree(
            this.layoutAnimationRoot, //
            { measure: true },
          ),
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  async animateLayout(duration: number): Promise<void> {
    if (!this.layoutAnimationRoot) return; // This method might be called before view init.
    await this.layoutAnimator.animate({
      root: this.layoutAnimationRoot,
      from: this.layoutAnimationSnapshots,
      duration,
      easing: AnimationCurves.STANDARD_CURVE,
      estimation: true,
    });
    this.layoutAnimationSnapshots.clear();
  }
}
