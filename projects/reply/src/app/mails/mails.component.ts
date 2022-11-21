import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs';

import { LayoutAnimator } from '../layout-projection/core/layout-animation';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LayoutAnimator) private layoutAnimator!: LayoutAnimator;
  private destroy$ = new EventEmitter();

  constructor(
    private router: Router,
    private childrenRouteOutletContexts: ChildrenOutletContexts,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const routerEvents = this.router.events.pipe(takeUntil(this.destroy$));

    routerEvents
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.layoutAnimator.snapshot();
      });

    routerEvents
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.getChildRouteLayoutType()),
        map(() => this.getChildRouteLayoutType()),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        requestAnimationFrame(async () => {
          // TODO: cleaner implementation for overflow styles

          this.elementRef.nativeElement
            .querySelectorAll<HTMLElement>('rpl-content > .wrapper')
            .forEach((element) => (element.style.overflow = 'visible'));

          const easing = AnimationCurves.STANDARD_CURVE;
          await this.layoutAnimator.animate(300, easing);

          this.elementRef.nativeElement
            .querySelectorAll<HTMLElement>('rpl-content > .wrapper')
            .forEach((element) => (element.style.overflow = ''));
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  getChildRouteLayoutType(): string {
    const context = this.childrenRouteOutletContexts.getContext('primary');
    if (!context) throw new Error('No primary outlet found');
    if (!context.route) throw new Error('No route found');
    const params = context.route.snapshot.params;
    return 'mailId' in params ? 'detail' : 'list';
  }
}
