import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { map, shareReplay } from 'rxjs';

import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.token';
import { BuiltInMailboxName, Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  SystemMailboxName = BuiltInMailboxName;
  navigationContext = inject(NAVIGATION_CONTEXT);
  private mailboxRepo = inject(MailboxRepository);

  @Input() @HostBinding('class.expanded') expanded = true;

  builtInMailboxNavItems$ = this.mailboxRepo
    .query((e) => e.type !== 'user')
    .pipe(
      map((mailboxes) => {
        const ids: Record<Mailbox['name'], Mailbox['id']> = {};
        mailboxes.forEach((m) => (ids[m.name] = m.id));
        return ids;
      }),
      map((ids) => (name: string, icon: string) => {
        const item = { id: ids[name], name, icon };
        return item;
      }),
      map((item) => [
        item(BuiltInMailboxName.Inbox, 'inbox'),
        item(BuiltInMailboxName.Starred, 'star'),
        item(BuiltInMailboxName.Sent, 'send'),
        item(BuiltInMailboxName.Trash, 'delete'),
        item(BuiltInMailboxName.Spam, 'report'),
        item(BuiltInMailboxName.Drafts, 'drafts'),
      ]),
      shareReplay(1),
    );

  userMailboxes$ = this.mailboxRepo.query((e) => e.type === 'user');

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
