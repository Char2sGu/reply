import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnimationCurves } from '@angular/material/core';

import { FadeThroughAnimation } from '../../core/animations';
import { NavFabService } from './nav-fab.service';

@Component({
  selector: 'rpl-nav-fab',
  templateUrl: './nav-fab.component.html',
  styleUrls: ['./nav-fab.component.scss'],
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
export class NavFabComponent {
  private service = inject(NavFabService);
  config = toSignal(this.service.config$, { requireSync: true });
  @Input() @HostBinding('class.expanded') expanded = false;
}
