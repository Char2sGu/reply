import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  filter,
  map,
  Observable,
  of,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

import { MAILBOX_STATE } from '../state/mailbox/mailbox.state-entry';
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
  private store = inject(Store);
  private router = inject(Router);

  readonly items$: Observable<NavigationItem[]> = this.store
    .select(MAILBOX_STATE.selectMailboxes)
    .pipe(
      map((collection) =>
        collection.query((e) => {
          const systemMailboxNames = Object.values(SystemMailboxName);
          const isSystemMailbox = systemMailboxNames.includes(e.name as any);
          return !isSystemMailbox;
        }),
      ),
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

  private activeItemPair$ = this.activeItemIndex$.pipe(
    switchMap((i) => {
      if (i === null) return of(null);
      return this.items$.pipe(map((items) => items[i]));
    }),
    startWith(null),
    pairwise(),
    shareReplay(1),
  );

  readonly currActiveItem$ = this.activeItemPair$.pipe(map(([, curr]) => curr));
  readonly lastActiveItem$ = this.activeItemPair$.pipe(map(([prev]) => prev));

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
