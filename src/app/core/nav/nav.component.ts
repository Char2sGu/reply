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

// https://stackoverflow.com/questions/55606944/how-to-implement-the-new-material-design-bottom-app-bar
const CLIP_PATH_REGULAR =
  'polygon(0 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 100% 0, 100% 100%, 0 100%)';
const CLIP_PATH_CLIPPED =
  'polygon(0 0, calc(50% - 38px) 0, calc(50% - 37.487665px) 0.628287px, calc(50% - 36.975331px) 1.256382px, calc(50% - 36.462997px) 1.884094px, calc(50% - 35.912306px) 2.511233px, calc(50% - 35.863009px) 3.137607px, calc(50% - 35.802788px) 3.763025px, calc(50% - 35.731661px) 4.387296px, calc(50% - 35.64965px) 5.010232px, calc(50% - 35.55678px) 5.631641px, calc(50% - 35.453079px) 6.251334px, calc(50% - 35.338579px) 6.869124px, calc(50% - 35.213314px) 7.484821px, calc(50% - 35.077322px) 8.098238px, calc(50% - 34.930646px) 8.709188px, calc(50% - 34.77333px) 9.317486px, calc(50% - 34.605421px) 9.922945px, calc(50% - 34.426971px) 10.525381px, calc(50% - 34.238035px) 11.124612px, calc(50% - 34.038669px) 11.720454px, calc(50% - 33.828934px) 12.312725px, calc(50% - 33.608895px) 12.901246px, calc(50% - 33.378619px) 13.485837px, calc(50% - 33.138175px) 14.066321px, calc(50% - 32.887636px) 14.642519px, calc(50% - 32.62708px) 15.214257px, calc(50% - 32.356586px) 15.781361px, calc(50% - 32.076235px) 16.343658px, calc(50% - 31.786113px) 16.900976px, calc(50% - 31.486309px) 17.453146px, calc(50% - 31.176915px) 18px, calc(50% - 30.858023px) 18.541371px, calc(50% - 30.529731px) 19.077094px, calc(50% - 30.19214px) 19.607005px, calc(50% - 29.845353px) 20.130945px, calc(50% - 29.489474px) 20.648752px, calc(50% - 29.124612px) 21.160269px, calc(50% - 28.750878px) 21.665341px, calc(50% - 28.368387px) 22.163813px, calc(50% - 27.977255px) 22.655534px, calc(50% - 27.5776px) 23.140354px, calc(50% - 27.169545px) 23.618125px, calc(50% - 26.753214px) 24.088702px, calc(50% - 26.328733px) 24.551941px, calc(50% - 25.896233px) 25.007701px, calc(50% - 25.455844px) 25.455844px, calc(50% - 25.007701px) 25.896233px, calc(50% - 24.551941px) 26.328733px, calc(50% - 24.088702px) 26.753214px, calc(50% - 23.618125px) 27.169545px, calc(50% - 23.140354px) 27.5776px, calc(50% - 22.655534px) 27.977255px, calc(50% - 22.163813px) 28.368387px, calc(50% - 21.665341px) 28.750878px, calc(50% - 21.160269px) 29.124612px, calc(50% - 20.648752px) 29.489474px, calc(50% - 20.130945px) 29.845353px, calc(50% - 19.607005px) 30.19214px, calc(50% - 19.077094px) 30.529731px, calc(50% - 18.541371px) 30.858023px, calc(50% - 18px) 31.176915px, calc(50% - 17.453146px) 31.486309px, calc(50% - 16.900976px) 31.786113px, calc(50% - 16.343658px) 32.076235px, calc(50% - 15.781361px) 32.356586px, calc(50% - 15.214257px) 32.62708px, calc(50% - 14.642519px) 32.887636px, calc(50% - 14.066321px) 33.138175px, calc(50% - 13.485837px) 33.378619px, calc(50% - 12.901246px) 33.608895px, calc(50% - 12.312725px) 33.828934px, calc(50% - 11.720454px) 34.038669px, calc(50% - 11.124612px) 34.238035px, calc(50% - 10.525381px) 34.426971px, calc(50% - 9.922945px) 34.605421px, calc(50% - 9.317486px) 34.77333px, calc(50% - 8.709188px) 34.930646px, calc(50% - 8.098238px) 35.077322px, calc(50% - 7.484821px) 35.213314px, calc(50% - 6.869124px) 35.338579px, calc(50% - 6.251334px) 35.453079px, calc(50% - 5.631641px) 35.55678px, calc(50% - 5.010232px) 35.64965px, calc(50% - 4.387296px) 35.731661px, calc(50% - 3.763025px) 35.802788px, calc(50% - 3.137607px) 35.863009px, calc(50% - 2.511233px) 35.912306px, calc(50% - 1.884094px) 35.950663px, calc(50% - 1.256382px) 35.97807px, calc(50% - 0.628287px) 35.994517px, 50% 36px, calc(50% + 0.628287px) 35.994517px, calc(50% + 1.256382px) 35.97807px, calc(50% + 1.884094px) 35.950663px, calc(50% + 2.511233px) 35.912306px, calc(50% + 3.137607px) 35.863009px, calc(50% + 3.763025px) 35.802788px, calc(50% + 4.387296px) 35.731661px, calc(50% + 5.010232px) 35.64965px, calc(50% + 5.631641px) 35.55678px, calc(50% + 6.251334px) 35.453079px, calc(50% + 6.869124px) 35.338579px, calc(50% + 7.484821px) 35.213314px, calc(50% + 8.098238px) 35.077322px, calc(50% + 8.709188px) 34.930646px, calc(50% + 9.317486px) 34.77333px, calc(50% + 9.922945px) 34.605421px, calc(50% + 10.525381px) 34.426971px, calc(50% + 11.124612px) 34.238035px, calc(50% + 11.720454px) 34.038669px, calc(50% + 12.312725px) 33.828934px, calc(50% + 12.901246px) 33.608895px, calc(50% + 13.485837px) 33.378619px, calc(50% + 14.066321px) 33.138175px, calc(50% + 14.642519px) 32.887636px, calc(50% + 15.214257px) 32.62708px, calc(50% + 15.781361px) 32.356586px, calc(50% + 16.343658px) 32.076235px, calc(50% + 16.900976px) 31.786113px, calc(50% + 17.453146px) 31.486309px, calc(50% + 18px) 31.176915px, calc(50% + 18.541371px) 30.858023px, calc(50% + 19.077094px) 30.529731px, calc(50% + 19.607005px) 30.19214px, calc(50% + 20.130945px) 29.845353px, calc(50% + 20.648752px) 29.489474px, calc(50% + 21.160269px) 29.124612px, calc(50% + 21.665341px) 28.750878px, calc(50% + 22.163813px) 28.368387px, calc(50% + 22.655534px) 27.977255px, calc(50% + 23.140354px) 27.5776px, calc(50% + 23.618125px) 27.169545px, calc(50% + 24.088702px) 26.753214px, calc(50% + 24.551941px) 26.328733px, calc(50% + 25.007701px) 25.896233px, calc(50% + 25.455844px) 25.455844px, calc(50% + 25.896233px) 25.007701px, calc(50% + 26.328733px) 24.551941px, calc(50% + 26.753214px) 24.088702px, calc(50% + 27.169545px) 23.618125px, calc(50% + 27.5776px) 23.140354px, calc(50% + 27.977255px) 22.655534px, calc(50% + 28.368387px) 22.163813px, calc(50% + 28.750878px) 21.665341px, calc(50% + 29.124612px) 21.160269px, calc(50% + 29.489474px) 20.648752px, calc(50% + 29.845353px) 20.130945px, calc(50% + 30.19214px) 19.607005px, calc(50% + 30.529731px) 19.077094px, calc(50% + 30.858023px) 18.541371px, calc(50% + 31.176915px) 18px, calc(50% + 31.486309px) 17.453146px, calc(50% + 31.786113px) 16.900976px, calc(50% + 32.076235px) 16.343658px, calc(50% + 32.356586px) 15.781361px, calc(50% + 32.62708px) 15.214257px, calc(50% + 32.887636px) 14.642519px, calc(50% + 33.138175px) 14.066321px, calc(50% + 33.378619px) 13.485837px, calc(50% + 33.608895px) 12.901246px, calc(50% + 33.828934px) 12.312725px, calc(50% + 34.038669px) 11.720454px, calc(50% + 34.238035px) 11.124612px, calc(50% + 34.426971px) 10.525381px, calc(50% + 34.605421px) 9.922945px, calc(50% + 34.77333px) 9.317486px, calc(50% + 34.930646px) 8.709188px, calc(50% + 35.077322px) 8.098238px, calc(50% + 35.213314px) 7.484821px, calc(50% + 35.338579px) 6.869124px, calc(50% + 35.453079px) 6.251334px, calc(50% + 35.55678px) 5.631641px, calc(50% + 35.64965px) 5.010232px, calc(50% + 35.731661px) 4.387296px, calc(50% + 35.802788px) 3.763025px, calc(50% + 35.863009px) 3.137607px, calc(50% + 35.912306px) 2.511233px, calc(50% + 36.462997px) 1.884094px, calc(50% + 36.975331px) 1.256382px, calc(50% + 37.487665px) 0.628287px, calc(50% + 38px) 0, 100% 0, 100% 100%, 0 100%)';

// There is no need to unsubscribe in this file as this component exists for
// the lifetime of the app.

@Component({
  selector: 'rpl-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('background', [
      state('regular', style({ clipPath: CLIP_PATH_REGULAR })),
      state('clipped', style({ clipPath: CLIP_PATH_CLIPPED })),
      transition(
        'regular <=> clipped',
        animate(`300ms ${AnimationCurves.STANDARD_CURVE}`),
      ),
    ]),
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
        animate(`300ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
      transition(':leave', [
        animate(`300ms ${AnimationCurves.STANDARD_CURVE}`),
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
      state('expanded', style({ height: 'calc(100vh - 54px)' })), // values from style sheet
      transition('* => expanded', [
        animate(`300ms ${AnimationCurves.DECELERATION_CURVE}`),
      ]),
    ]),
  ],
})
export class NavComponent implements OnInit, AfterViewInit {
  bottomMenuToggling = false;
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

  async toggleBottomMenu(to = !this.bottomMenuOpened): Promise<void> {
    if (to === this.bottomMenuOpened) return;

    if (this.bottomMenuToggling) return;
    this.bottomMenuToggling = true;
    if (to === true) {
      this.bottomMenuOpened = true;
      this.bottomMenuExpanded = false;
      this.bottomMenuPortal.attach(this.bottomMenuOverlayRef);
    } else {
      this.bottomMenuPortal.detach();
      await new Promise((r) => {
        setTimeout(r, 200); // delay for animation
      });
      this.bottomMenuExpanded = false;
      this.bottomMenuOpened = false;
    }
    this.bottomMenuToggling = false;
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
