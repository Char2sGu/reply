import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Overlay, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { delay, first } from 'rxjs';

import { BreakpointManager, BreakpointMap } from '../breakpoint.manager';

// There is no need to unsubscribe in this file as this component exists for
// the lifetime of the app.

@Component({
  selector: 'rpl-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('arrow', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', [
        animate(`200ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
    ]),
    trigger('fab', [
      transition(':enter', [
        style({ transform: 'scale(0.01)' }),
        animate(`200ms 200ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
      transition(':leave', [
        animate(`200ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ transform: 'scale(0.01)' }),
      ]),
    ]),
    trigger('bottomMenu', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate(`200ms ${AnimationCurves.DECELERATION_CURVE}`),
      ]),
      // TODO: animation looks weird when expanded.
      transition(':leave', [
        animate(`200ms ${AnimationCurves.ACCELERATION_CURVE}`),
        style({ transform: 'translateY(100%)' }),
      ]),
      state('expanded', style({ height: 'calc(100vh - 54px - 32px * 2)' })), // values from style sheet
      transition('* => expanded', [
        animate(`300ms ${AnimationCurves.DECELERATION_CURVE}`),
      ]),
    ]),
  ],
})
export class NavComponent implements OnInit, AfterViewInit {
  bottomMenuOpened = false;
  bottomMenuExpanded = false;
  private bottomMenuOverlayRef!: OverlayRef;
  private bottomMenuPortal!: TemplatePortal;
  @ViewChild('bottomMenu') private bottomMenuTemplate!: TemplateRef<unknown>;

  constructor(
    private breakpointManager: BreakpointManager,
    private overlayContainerRef: OverlayContainer,
    private overlayManager: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.subscribeBreakpointsToUpdateOverlayContainerStyles();
  }

  ngAfterViewInit(): void {
    this.initializeBottomMenu();
  }

  onLogoClick(): void {
    this.breakpointManager.breakpoints$
      .pipe(first())
      .subscribe((breakpoints) => {
        if (!isPhone(breakpoints)) return;
        this.toggleBottomMenu();
      });
  }

  onBottomMenuPanDown(): void {
    if (!this.bottomMenuOpened) return;
    this.toggleBottomMenu(false);
  }

  onBottomMenuPanUp(): void {
    if (!this.bottomMenuOpened) return;
    this.bottomMenuExpanded = true;
  }

  toggleBottomMenu(to = !this.bottomMenuOpened): void {
    if (to === this.bottomMenuOpened) return;
    if (to === true) {
      this.bottomMenuOpened = true;
      this.bottomMenuExpanded = false;
      this.bottomMenuPortal.attach(this.bottomMenuOverlayRef);
    } else {
      this.bottomMenuPortal.detach();
      this.bottomMenuExpanded = false;
      this.bottomMenuOpened = false;
    }
  }

  private subscribeBreakpointsToUpdateOverlayContainerStyles(): void {
    this.breakpointManager.breakpoints$
      .pipe(delay(0)) // wait for DOM update
      .subscribe((breakpoints) => {
        const overlayContainer = this.overlayContainerRef.getContainerElement();
        if (isPhone(breakpoints)) {
          const navHeight = this.elementRef.nativeElement.offsetHeight;
          overlayContainer.style.height = `calc(100% - ${navHeight}px)`;
          overlayContainer.style.overflow = 'hidden';
        } else {
          overlayContainer.style.height = '';
          overlayContainer.style.overflow = '';
        }
      });
  }

  private initializeBottomMenu(): void {
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

    this.breakpointManager.breakpoints$.subscribe((breakpoints) => {
      if (!isPhone(breakpoints)) this.toggleBottomMenu(false);
    });
  }
}

function isPhone(breakpoints: BreakpointMap): boolean {
  return !breakpoints['tablet-portrait'];
}
