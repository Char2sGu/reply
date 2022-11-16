import { query, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutContext } from '@/app/core/layout.context';
import { NavigationContext } from '@/app/core/navigation.context';

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // TODO: shared axis animation
    trigger('content', [
      transition(':increment', [
        query(':leave', style({ position: 'absolute' })),
        SharedAxisAnimation.apply('y', 'forward'),
      ]),
      transition(':decrement', [
        query(':leave', style({ position: 'absolute' })),
        SharedAxisAnimation.apply('y', 'backward'),
      ]),
    ]),
  ],
})
export class MailListLayoutComponent implements OnInit, OnDestroy {
  breakpoints$ = this.breakpointManager.breakpoints$;
  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));

  destroy$ = new EventEmitter();

  constructor(
    public layoutContext: LayoutContext,
    public navigationContext: NavigationContext,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointManager: BreakpointManager,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
