import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';

import { NavigationContext } from '../navigation.context';
@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent implements OnInit {
  @Input() @HostBinding('class.expanded') expanded = true;

  constructor(private navigationContext: NavigationContext) {}

  ngOnInit(): void {}

  onItemActive(name: string, index: number): void {
    this.navigationContext.latestMailboxUrl = this.getMailboxUrl(name);
    this.navigationContext.latestMailboxIndex = index;
  }

  getMailboxUrl(name: string): string {
    return `/mailboxes/${name}/mails`;
  }
}
