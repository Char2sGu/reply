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

import { BreakpointManager } from '../breakpoint.manager';

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
    trigger('bottomMenu', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate(`200ms ${AnimationCurves.DECELERATION_CURVE}`),
      ]),
    ]),
  ],
})
export class NavComponent implements OnInit, AfterViewInit {
  bottomMenuOpened = false;
  bottomMenuOverlayRef!: OverlayRef;
  bottomMenuPortal!: TemplatePortal;
  @ViewChild('bottomMenu') bottomMenuTemplate!: TemplateRef<unknown>;

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
        const isPhone = !breakpoints['tablet-portrait'];
        if (!isPhone) return;
        this.toggleBottomMenu();
      });
  }

  private toggleBottomMenu(): void {
    this.bottomMenuOpened = !this.bottomMenuOpened;
    if (this.bottomMenuOpened)
      this.bottomMenuPortal.attach(this.bottomMenuOverlayRef);
    else this.bottomMenuPortal.detach();
  }

  private subscribeBreakpointsToUpdateOverlayContainerStyles(): void {
    this.breakpointManager.breakpoints$ // no need to unsubscribe as this component exists for the lifetime of the app
      .pipe(delay(0)) // wait for DOM update
      .subscribe((breakpoints) => {
        const isPhone = !breakpoints['tablet-portrait'];
        const overlayContainer = this.overlayContainerRef.getContainerElement();
        if (isPhone) {
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
    this.bottomMenuPortal = new TemplatePortal(
      this.bottomMenuTemplate,
      this.viewContainerRef,
    );
  }
}
