import { query, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { SharedAxisAnimation } from '@/app/common/animations';
import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutContext } from '@/app/core/layout.context';
import { NavigationContext } from '@/app/core/navigation.context';
import { LayoutAnimator } from '@/app/layout-projection/core/layout-animation';

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

  private scrollable!: HTMLElement;

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
    // TODO: cleaner implementation

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.scrollable = this.elementRef.nativeElement //
      .querySelector<HTMLElement>('rpl-content > .wrapper')!;

    const tick = () => new Promise((r) => requestAnimationFrame(r));

    // The content might have changed, so we need to correct the scroll top.
    this.scrollable.scrollTop = scrollTop;
    scrollTop = this.scrollable.scrollTop;
    this.scrollable.scrollTop = 0;

    // We have to use a fake scroll here because we want to show the overflow
    // content in the layout animation.
    this.scrollable.style.overflow = 'visible';
    this.scrollable.style.position = 'relative';
    this.scrollable.style.top = `${-scrollTop}px`;

    await tick();
    await this.layoutAnimator.animate(250, AnimationCurves.STANDARD_CURVE);

    this.scrollable.style.overflow = '';
    this.scrollable.style.position = '';
    this.scrollable.style.top = '';
    this.scrollable.scrollTop = scrollTop;

    // Changing scrollTop will result in a scroll event, which would result in
    // a wrong contentFavored change, so we have to correct it back.
    await tick();
    this.layoutContext.contentFavored = false;
  }

  ngOnDestroy(): void {
    scrollTop = this.scrollable.scrollTop;
  }
}
