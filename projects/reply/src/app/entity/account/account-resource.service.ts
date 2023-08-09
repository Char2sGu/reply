import { inject, Injectable } from '@angular/core';

import { Exception } from '@/app/core/exceptions';
import { PersistentValueAccessor } from '@/app/core/persistent-value';

import { Account } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountResource {
  private accounts = inject(AccountsAccessor);

  list(): Account[] {
    let accounts = this.accounts.get();
    if (!accounts) {
      accounts = [];
      this.accounts.set(accounts);
    }
    return [...accounts];
  }

  create(payload: Account): void {
    const accounts = this.list();
    accounts.push(payload);
    this.accounts.set(accounts);
  }

  patch(id: Account['id'], payload: Partial<Account>): void {
    const accounts = this.list();
    const index = accounts.findIndex((a) => a.id === id);
    if (index < 0) throw new TargetAccountNotFoundException();
    const patched = accounts.map((a) =>
      a.id === id ? { ...a, ...payload, id: a.id } : a,
    );
    this.accounts.set(patched);
  }

  put(payload: Account): void {
    const accounts = this.list();
    const account = accounts.find((a) => a.id === payload.id);
    if (!account) return this.create(payload);
    return this.patch(account.id, payload);
  }

  delete(id: Account['id']): void {
    const accounts = this.list();
    const index = accounts.findIndex((a) => a.id === id);
    if (index < 0) throw new TargetAccountNotFoundException();
    accounts.splice(index, 1);
    this.accounts.set(accounts);
  }
}

export class AccountResourceException extends Exception {}
export class TargetAccountNotFoundException extends AccountResourceException {}

@Injectable({
  providedIn: 'root',
})
class AccountsAccessor extends PersistentValueAccessor<Account[]> {
  readonly key = 'accounts';

  protected override parse(raw: string): Account[] {
    const items: Record<keyof Account, unknown>[] = JSON.parse(raw);
    return items.map((item) => ({
      id: item.id as Account['id'],
      profile: item.profile as Account['profile'],
      authorizedAt: new Date(item.authorizedAt as string),
    }));
  }
}
