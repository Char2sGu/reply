import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';

import { FadeThroughAnimation } from '../animations';
import { LAYOUT_CONTEXT } from '../layout-context.token';

@Component({
  selector: 'rpl-nav-floating-action-button',
  templateUrl: './nav-floating-action-button.component.html',
  styleUrls: ['./nav-floating-action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('host', [
      transition(':enter', [
        style({ transform: 'scale(0.01)' }),
        animate(`300ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
      transition(':leave', [
        animate(`300ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ transform: 'scale(0.01)' }),
      ]),
    ]),
    trigger('icon', [
      transition(':enter, :leave', []),
      transition('* => *', [FadeThroughAnimation.apply()]),
    ]),
  ],
})
export class NavFloatingActionButtonComponent {
  layoutContext = inject(LAYOUT_CONTEXT);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() @HostBinding('class.expanded') expanded = false;

  constructor() {
    // TODO: find out why and try to remove this effect
    effect(() => {
      this.layoutContext();
      this.changeDetector.markForCheck();
    });
  }
}
