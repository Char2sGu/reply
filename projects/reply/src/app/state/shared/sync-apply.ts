import { SyncChange } from '@/app/entity/core/synchronization';

import { EntityCollection, EntityNotFoundException } from './entity-collection';

export function applySyncChanges<Entity>(
  changes: SyncChange<Entity>[],
  collection: EntityCollection<Entity>,
): EntityCollection<Entity> {
  return changes.reduce(
    (acc, change) => applySyncChange(change, acc),
    collection,
  );
}

export function applySyncChange<Entity>(
  change: SyncChange<Entity>,
  collection: EntityCollection<Entity>,
): EntityCollection<Entity> {
  try {
    switch (change.type) {
      case 'deletion':
        return collection.delete(change.id);
      case 'creation':
        return collection.insert(change.payload);
      case 'update':
        return collection.update(change.id, change.payload);
      case 'creation-or-update':
        return collection.upsert(change.payload);
      default:
        throw new Error(`Unknown sync change\n${JSON.stringify(change)}`);
    }
  } catch (error) {
    // It's possible that the changed entity has already been deleted or never
    // existed in our collection.
    if (error instanceof EntityNotFoundException) return collection;
    throw error;
  }
}
