import { Injectable } from '@angular/core';
import {
  combineLatest,
  concatMap,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';

import { EntityDatabase } from './entity-database';
import { ReactiveRepository } from './reactive-repository';

@Injectable({
  providedIn: 'root',
})
export class EntityDataSourceSynchronizer {
  sync<Entity>(
    repository: ReactiveRepository<Entity>,
    database: EntityDatabase<Entity, any>,
  ): Observable<void> {
    return combineLatest([
      this.populateRepositoryWithDatabase(repository, database),
      this.syncUpdates(repository, database),
    ]).pipe(map(() => undefined));
  }

  private populateRepositoryWithDatabase<Entity>(
    repository: ReactiveRepository<Entity>,
    database: EntityDatabase<Entity, any>,
  ): Observable<void> {
    return database.list().pipe(
      tap((entities) => entities.forEach((e) => repository.insert(e))),
      map(() => undefined),
    );
  }

  private syncUpdates<Entity>(
    repository: ReactiveRepository<Entity>,
    database: EntityDatabase<Entity, any>,
  ): Observable<void> {
    return repository.update$.pipe(
      concatMap((update) => {
        if (update.curr) return database.persist(update.curr);
        if (update.prev) return database.delete(update.id);
        return throwError(() => new Error('Invalid update'));
      }),
    );
  }
}
