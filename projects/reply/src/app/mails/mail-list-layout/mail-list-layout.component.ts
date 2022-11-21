import { query, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { SharedAxisAnimation } from '@/app/common/animations';
import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutContext } from '@/app/core/layout.context';
import { NavigationContext } from '@/app/core/navigation.context';
import { LayoutAnimator } from '@/app/layout-projection/core/layout-animation';
import { ContentComponent } from '@/app/standalone/content/content.component';

let scrollTop = 0;

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
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

  @ViewChild(ContentComponent) private content!: ContentComponent;

  constructor(
    public layoutContext: LayoutContext,
    public navigationContext: NavigationContext,
    private route: ActivatedRoute,
    private breakpointManager: BreakpointManager,
    private layoutAnimator: LayoutAnimator,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    this.content.fakeScroll(scrollTop);
    await this.layoutAnimator.animate(250, AnimationCurves.STANDARD_CURVE);
    this.content.setScrollTop(scrollTop);
  }

  ngOnDestroy(): void {
    scrollTop = this.content.getScrollTop();
  }
}
