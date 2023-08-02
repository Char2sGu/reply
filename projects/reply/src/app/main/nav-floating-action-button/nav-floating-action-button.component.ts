import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';

import { useState } from '@/app/core/state';

import { FadeThroughAnimation } from '../../core/animations';
import { LAYOUT_CONTEXT } from '../../core/layout-context.state';

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
  layoutContext = useState(LAYOUT_CONTEXT);
  @Input() @HostBinding('class.expanded') expanded = false;
}
