import { transition, trigger } from '@angular/animations';
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

import { FadeThroughAnimation } from '@/app/core/animations';
import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutContext } from '@/app/core/layout.context';
import { MailboxContext } from '@/app/core/mailbox.context';

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
    public layoutContext: LayoutContext,
    private mailboxContext: MailboxContext,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointManager: BreakpointManager,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.mailboxName$.subscribe(
      (mailboxName) => (this.mailboxContext.current = mailboxName),
    );

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
