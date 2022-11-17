import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';

@Component({
  selector: 'rpl-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('arrow', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', [
        animate(`200ms ${AnimationCurves.STANDARD_CURVE}`),
      ]),
    ]),
    trigger('fab', [transition(':enter', [])]), // disable entering animation
  ],
})
export class SideNavComponent implements OnInit {
  @Input() @HostBinding('class.expanded') expanded = false;
  @Output() expandedChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
