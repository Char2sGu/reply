import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

import { MailboxRepository } from '../entity/mailbox/mailbox.repository';
import { SystemMailboxName, VirtualMailboxName } from './mailbox-name.enums';

const STATIC_ITEMS = [
  { name: SystemMailboxName.Inbox, icon: 'inbox' },
  { name: VirtualMailboxName.Starred, icon: 'star' },
  { name: VirtualMailboxName.Sent, icon: 'send' },
  { name: SystemMailboxName.Trash, icon: 'delete' },
  { name: SystemMailboxName.Spam, icon: 'report' },
  { name: VirtualMailboxName.Drafts, icon: 'drafts' },
];

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private mailboxRepo = inject(MailboxRepository);

  readonly items$: Observable<NavigationItem[]> = this.mailboxRepo
    .query((e) => {
      const systemMailboxNames = Object.values(SystemMailboxName);
      const isSystemMailbox = systemMailboxNames.includes(e.name as any);
      return !isSystemMailbox;
    })
    .pipe(
      map((mailboxes) => mailboxes.map(({ name }) => ({ name }))),
      map((items) => [...STATIC_ITEMS, ...items]),
      map((items) =>
        items.map((item) => ({
          ...item,
          url: `/mailboxes/${item.name}/mails`,
        })),
      ),
      shareReplay(1),
    );

  readonly activeItemIndex$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    switchMap(() => this.items$),
    map((items) => this.findActiveItemIndex(items)),
    shareReplay(1),
  );

  readonly activeItem$ = this.activeItemIndex$.pipe(
    switchMap((i) => {
      if (i === null) return of(null);
      return this.items$.pipe(map((items) => items[i]));
    }),
    shareReplay(1),
  );

  private findActiveItemIndex(items: NavigationItem[]): number | null {
    const result = items.findIndex((i) =>
      this.router.isActive(i.url, {
        paths: 'subset',
        fragment: 'ignored',
        queryParams: 'ignored',
        matrixParams: 'ignored',
      }),
    );
    return result >= 0 ? result : null;
  }
}

export interface NavigationItem {
  name: string;
  url: string;
  icon?: string;
}
