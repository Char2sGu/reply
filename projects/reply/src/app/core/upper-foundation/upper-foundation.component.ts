import { query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FadeThroughAnimation,
  injectAnimationIdFactory,
} from '../../common/animations';

@Component({
  selector: 'rpl-upper-foundation',
  templateUrl: './upper-foundation.component.html',
  styleUrls: ['./upper-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('main', [
      transition(':enter, :leave, * <=> none', []),
      transition('* => *', [
        query(':self', style({ position: 'relative' })),
        query(':enter, :leave', style({ width: '100%' })),
        FadeThroughAnimation.apply(),
      ]),
    ]),
  ],
})
export class UpperFoundationComponent {
  animationId = injectAnimationIdFactory();
}
