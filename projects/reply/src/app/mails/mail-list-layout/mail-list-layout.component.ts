import { transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';

import { FadeThroughAnimation } from '@/app/core/animations';
import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutContext } from '@/app/core/layout.context';
import { RouterStatus } from '@/app/core/router-status.state';

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // TODO: shared axis animation
    trigger('content', [
      transition(':enter, :leave', []),
      transition('* => *', [FadeThroughAnimation.apply()]),
    ]),
  ],
})
export class MailListLayoutComponent implements OnInit, OnDestroy {
  breakpoints$ = this.breakpointManager.breakpoints$;
  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));

  destroy$ = new EventEmitter();

  constructor(
    public layout: LayoutContext,
    private route: ActivatedRoute,
    private routerStatus: RouterStatus,
    private breakpointManager: BreakpointManager,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.routerStatus.navigating$
      .pipe(
        filter((navigating) => !navigating),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
