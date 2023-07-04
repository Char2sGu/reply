import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  OnInit,
} from '@angular/core';

import { NAVIGATION_CONTEXT } from '../navigation-context.token';
@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent implements OnInit {
  ItemName = NavMenuItemName;
  navigationContext = inject(NAVIGATION_CONTEXT);

  @Input() @HostBinding('class.expanded') expanded = true;

  ngOnInit(): void {}

  onItemActive(name: string, index: number): void {
    this.navigationContext.mutate((c) => {
      c.latestMailboxUrl = this.getMailboxUrl(name);
      c.latestMailboxIndex = index;
    });
  }

  getMailboxUrl(name: string): string {
    return `/mailboxes/${name}/mails`;
  }
}

export enum NavMenuItemName {
  Inbox = 'Inbox',
  Starred = 'Starred',
  Sent = 'Sent',
  Trash = 'Trash',
  Spam = 'Spam',
  Drafts = 'Drafts',
}
