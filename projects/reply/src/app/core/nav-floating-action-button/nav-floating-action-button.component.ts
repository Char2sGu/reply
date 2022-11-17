import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';

import { FadeThroughAnimation } from '../../common/animations';
import { LayoutContext } from '../layout.context';

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
export class NavFloatingActionButtonComponent implements OnInit {
  @Input() @HostBinding('class.expanded') expanded = false;

  constructor(public layoutContext: LayoutContext) {}

  ngOnInit(): void {}
}
