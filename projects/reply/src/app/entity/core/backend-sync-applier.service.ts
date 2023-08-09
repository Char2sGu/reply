import { Injectable } from '@angular/core';

import { Exception } from '@/app/core/exceptions';

import { SyncChange } from './backend.models';
import { ReactiveRepository } from './reactive-repository';
import { EntityNotFoundException } from './reactive-repository.exceptions';

@Injectable({
  providedIn: 'root',
})
export class BackendSyncApplier {
  applyChange<Entity>(
    repo: ReactiveRepository<Entity>,
    change: SyncChange<Entity>,
  ): void {
    try {
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
          throw new InvalidSyncChangeTypeException(change);
      }
    } catch (error) {
      // It's possible that the entity has already been deleted or never
      // existed in our repository.
      if (error instanceof EntityNotFoundException) return;
      throw error;
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

export class BackendSyncApplierException extends Exception {}
export class InvalidSyncChangeTypeException extends BackendSyncApplierException {
  constructor(change: SyncChange<unknown>) {
    super(`Invalid sync change type "${change.type}"`);
  }
}
