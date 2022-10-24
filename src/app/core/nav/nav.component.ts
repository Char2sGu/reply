import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { delay } from 'rxjs';

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
  ],
})
export class NavComponent implements OnInit {
  bottomMenuOpened = false;
  @ViewChild('menu') menuTemplate!: TemplateRef<unknown>;

  constructor(
    private breakpointManager: BreakpointManager,
    private overlayContainerRef: OverlayContainer,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.subscribeBreakpointsToUpdateOverlayContainerStyles();
  }

  onLogoClick(): void {
    this.bottomMenuOpened = !this.bottomMenuOpened;
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
}
