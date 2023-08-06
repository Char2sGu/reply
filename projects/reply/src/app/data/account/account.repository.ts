import { Injectable } from '@angular/core';

import { ReactiveRepository } from '../core/reactive-repository';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountRepository extends ReactiveRepository<Account> {
  identify(entity: Account): string {
    return entity.id;
  }
}
