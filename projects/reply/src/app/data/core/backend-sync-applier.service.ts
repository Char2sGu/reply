import { Injectable } from '@angular/core';

import { SyncChange } from './backend.models';
import { ReactiveRepository } from './reactive-repository';

@Injectable({
  providedIn: 'root',
})
export class BackendSyncApplier {
  applyChange<Entity>(
    repo: ReactiveRepository<Entity>,
    change: SyncChange<Entity>,
  ): void {
    switch (change.type) {
      case 'deletion': {
        repo.delete(change.id);
        break;
      }
      case 'creation': {
        repo.insert(change.payload);
        break;
      }
      case 'update': {
        repo.patch(change.id, change.payload);
        break;
      }
      case 'creation-or-update':
        repo.record(change.payload);
        break;
      default:
        throw new Error(`Unknown change ${change}`);
    }
  }

  applyChanges<Entity>(
    repo: ReactiveRepository<Entity>,
    changes: SyncChange<Entity>[],
  ): void {
    changes.forEach((change) => {
      this.applyChange(repo, change);
    });
  }
}
