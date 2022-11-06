import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';

import { LayoutConfig } from '../layout.config';

@Component({
  selector: 'rpl-nav-floating-action-button',
  templateUrl: './nav-floating-action-button.component.html',
  styleUrls: ['./nav-floating-action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavFloatingActionButtonComponent implements OnInit {
  @Input() @HostBinding('class.expanded') expanded = false;

  constructor(public layoutConfig: LayoutConfig) {}

  ngOnInit(): void {}
}
