import { Injectable } from '@angular/core';
import { concatMap, map, Observable, tap, throwError } from 'rxjs';

import { EntityDatabase } from './entity-database';
import { ReactiveRepository } from './reactive-repository';

@Injectable({
  providedIn: 'root',
})
export class EntityDataSourceSynchronizer {
  syncDatabaseWithRepo<Entity>(
    repository: ReactiveRepository<Entity>,
    database: EntityDatabase<Entity, any>,
  ): Observable<void> {
    return repository.update$.pipe(
      concatMap((update) => {
        if (update.curr) return database.persist(update.curr);
        if (update.prev) return database.delete(update.id);
        return throwError(
          () => new EntityDataSourceSynchronizationException('Invalid update'),
        );
      }),
    );
  }

  syncRepoWithDatabase<Entity>(
    repository: ReactiveRepository<Entity>,
    database: EntityDatabase<Entity, any>,
  ): Observable<void> {
    return database.list().pipe(
      tap((entities) => entities.forEach((e) => repository.insert(e))),
      map(() => undefined),
    );
  }
}

export class EntityDataSourceSynchronizationException extends Error {}
