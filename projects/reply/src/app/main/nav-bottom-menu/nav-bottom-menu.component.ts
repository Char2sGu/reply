import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'rpl-nav-bottom-menu',
  templateUrl: './nav-bottom-menu.component.html',
  styleUrls: ['./nav-bottom-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBottomMenuComponent implements OnInit {
  @Input() @HostBinding('class.expanded') expanded = false;

  constructor() {}

  ngOnInit(): void {}
}
