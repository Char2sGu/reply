import {
  animate,
  animateChild,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Overlay, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  delay,
  filter,
  first,
  switchMap,
  takeUntil,
} from 'rxjs';

import { LayoutContext } from '../layout.context';
import { RouterStatus } from '../router-status.state';

@Component({
  selector: 'rpl-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('arrow', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', [
        animate(`200ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
    ]),
    trigger('fab', [transition(':leave', [query('@*', animateChild())])]),
    trigger('bottomMenu', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate(`200ms ${AnimationCurves.DECELERATION_CURVE}`),
      ]),
      transition(':leave', [
        animate(`200ms ${AnimationCurves.ACCELERATION_CURVE}`),
        style({ transform: 'translateY(100%)' }),
      ]),
    ]),
    trigger('bottomActions', [
      transition(':enter', []),
      transition(':leave', []),
      transition('* => *', [
        query(':enter', [
          style({ transform: 'scale(92%)', opacity: 0 }),
          stagger('40ms', [
            animate(
              `210ms 90ms ${AnimationCurves.DECELERATION_CURVE}`,
              style({ transform: 'scale(1)', opacity: 1 }),
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class NavComponent implements OnInit, AfterViewInit, OnDestroy {
  // prettier-ignore
  @Input() set mode(value: NavMode) { this.mode$.next(value) }
  mode$ = new BehaviorSubject<NavMode>('drawer');
  @HostBinding('class') get modeClassBinding(): Record<string, boolean> {
    const name = `mode-${this.mode$.value}`;
    return { [name]: true };
  }

  logoClick$ = new EventEmitter();

  bottomMenuPan$ = new EventEmitter<'up' | 'down'>();
  bottomMenuToggling = false;
  bottomMenuOpened = false;
  bottomMenuExpanded = false;
  private bottomMenuOverlayRef!: OverlayRef;
  private bottomMenuPortal!: TemplatePortal;
  @ViewChild('bottomMenu') private bottomMenuTemplate!: TemplateRef<unknown>;

  @HostBinding('class.unfavored') get unfavored(): boolean {
    return this.layoutContext.contentFavored;
  }

  destroy$ = new EventEmitter();

  constructor(
    public layoutContext: LayoutContext,
    private router: Router,
    private routerStatus: RouterStatus,
    private overlayContainerRef: OverlayContainer,
    private overlayManager: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.logoClick$
      .pipe(
        switchMap(() => this.mode$.pipe(first())),
        filter((mode) => mode === 'bar'),
      )
      .subscribe(() => {
        this.toggleBottomMenu();
      });

    this.bottomMenuPan$
      .pipe(filter(() => this.bottomMenuOpened))
      .subscribe((direction) => {
        if (direction === 'up') this.bottomMenuExpanded = true;
        else this.toggleBottomMenu(false);
      });
  }

  ngAfterViewInit(): void {
    this.setupOverlayContainer();
    this.setupBottomMenu();
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }

  async toggleBottomMenu(to = !this.bottomMenuOpened): Promise<void> {
    if (to === this.bottomMenuOpened) return;

    if (this.bottomMenuToggling) return;
    this.bottomMenuToggling = true;
    if (to === true) {
      this.bottomMenuOpened = true;
      this.bottomMenuExpanded = false;
      this.bottomMenuPortal.attach(this.bottomMenuOverlayRef);
      // Perform a navigation so that the user can close the bottom menu by
      // clicking the back button of the browser because the bottom menu
      // will be closed on navigation.
      const urlTree = this.router.parseUrl(this.router.url);
      urlTree.fragment = 'bottom-menu';
      this.router.navigateByUrl(urlTree);
    } else {
      this.bottomMenuPortal.detach();
      await new Promise((r) => {
        setTimeout(r, 200); // delay for animation for better visuals
      });
      this.bottomMenuExpanded = false;
      this.bottomMenuOpened = false;
      this.changeDetectorRef.markForCheck();
      const urlTree = this.router.parseUrl(this.router.url);
      urlTree.fragment = null;
      this.router.navigateByUrl(urlTree);
    }
    this.bottomMenuToggling = false;
  }

  private setupOverlayContainer(): void {
    this.mode$
      .pipe(delay(0)) // wait for DOM update
      .subscribe((mode) => {
        const overlayContainer = this.overlayContainerRef.getContainerElement();
        if (mode === 'bar') {
          const navHeight = this.elementRef.nativeElement.offsetHeight;
          overlayContainer.style.height = `calc(100% - ${navHeight}px)`;
          overlayContainer.style.overflow = 'hidden';
        } else {
          overlayContainer.style.height = '';
          overlayContainer.style.overflow = '';
        }
      });
  }

  private setupBottomMenu(): void {
    this.bottomMenuOverlayRef = this.overlayManager.create({
      hasBackdrop: true,
      positionStrategy: this.overlayManager
        .position()
        .global()
        .centerHorizontally()
        .bottom('0'),
    });
    this.bottomMenuOverlayRef
      .backdropClick()
      .subscribe(() => this.toggleBottomMenu(false));
    this.bottomMenuPortal = new TemplatePortal(
      this.bottomMenuTemplate,
      this.viewContainerRef,
    );

    this.routerStatus.navigating$
      .pipe(
        filter((navigating) => navigating),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.toggleBottomMenu(false));

    this.mode$.subscribe((mode) => {
      if (mode !== 'bar') this.toggleBottomMenu(false);
    });
  }
}

export type NavMode = 'drawer' | 'rail' | 'bar';
