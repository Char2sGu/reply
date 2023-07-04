import { animate, query, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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

import { ChildRouteAnimationHost } from '../common/child-route-animation-host';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('route', [
      transition('list => detail', [query(':leave', [animate('500ms')])]),
    ]),
  ],
})
export class MailsComponent
  extends ChildRouteAnimationHost
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(ProjectionNode) private layoutAnimationRoot!: ProjectionNode;
  private layoutAnimationSnapshots = new ProjectionNodeSnapshotMap();

  private destroy$ = new EventEmitter();

  constructor(
    private router: Router,
    private layoutAnimator: LayoutAnimator,
    private layoutSnapper: ProjectionNodeSnapper,
  ) {
    super();
  }

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
