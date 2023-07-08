import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';

import {
  SystemMailboxName,
  VirtualMailboxName,
} from '@/app/core/mailbox-name.enums';
import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.token';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  private navigationContext = inject(NAVIGATION_CONTEXT);
  private mailboxRepo = inject(MailboxRepository);

  @Input() @HostBinding('class.expanded') expanded = true;

  staticItems = [
    { name: SystemMailboxName.Inbox, icon: 'inbox' },
    { name: VirtualMailboxName.Starred, icon: 'star' },
    { name: VirtualMailboxName.Sent, icon: 'send' },
    { name: SystemMailboxName.Trash, icon: 'delete' },
    { name: SystemMailboxName.Spam, icon: 'report' },
    { name: VirtualMailboxName.Drafts, icon: 'drafts' },
  ];

  mailboxes$ = this.mailboxRepo.query(
    (e) =>
      !Object.values(SystemMailboxName).includes(e.name as SystemMailboxName),
  );

  onItemActive(name: Mailbox['name'], index: number): void {
    this.navigationContext.mutate((c) => {
      c.latestMailboxUrl = this.getMailboxUrl(name);
      c.latestMailboxIndex = index;
    });
  }

  getMailboxUrl(name: Mailbox['name']): string {
    return `/mailboxes/${name}/mails`;
  }
}
