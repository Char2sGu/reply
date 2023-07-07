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
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ProjectionNodeDirective } from '@layout-projection/angular';
import {
  LayoutAnimator,
  ProjectionNode,
  ProjectionNodeSnapper,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';
import { filter, map, takeUntil } from 'rxjs';

export class MailsLayoutAnimationService {
  private layoutAnimator = inject(LayoutAnimator);
  private root = inject(ProjectionNode);
  private snapshots = new ProjectionNodeSnapshotMap();

  storeSnapshots(snapshots: ProjectionNodeSnapshotMap): void {
    this.snapshots.merge(snapshots);
  }

  async animateLayout(duration: number): Promise<void> {
    await this.layoutAnimator.animate({
      root: this.root,
      from: this.snapshots,
      duration,
      easing: AnimationCurves.STANDARD_CURVE,
      estimation: true,
    });
    this.snapshots.clear();
  }
}

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MailsLayoutAnimationService],
  hostDirectives: [ProjectionNodeDirective],
})
export class MailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private layoutSnapper = inject(ProjectionNodeSnapper);
  private layoutAnimationService = inject(MailsLayoutAnimationService);

  detailed$ = this.route.params.pipe(map((params) => !!params['mailId']));

  @ViewChild('listLayoutNode') private listLayoutNode!: ProjectionNode;
  @ViewChild('detailLayoutNode') private detailLayoutNode?: ProjectionNode;

  private destroy$ = new EventEmitter();

  constructor() {
    inject(ProjectionNode, { self: true }).identifyAs('mails');
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        const snapshots = this.layoutSnapper.snapshotTree(
          this.detailLayoutNode ?? this.listLayoutNode, //
          { measure: true },
        );
        this.layoutAnimationService.storeSnapshots(snapshots);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
