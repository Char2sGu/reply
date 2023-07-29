import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';

import { EntityDatabase } from './entity-database';
import { ReactiveRepository } from './reactive-repository';

export function populateRepositoryWithDatabase<Entity>(
  repository: ReactiveRepository<Entity>,
  database: EntityDatabase<Entity, never>,
): Observable<void> {
  return database.list().pipe(
    tap((entities) => entities.forEach((e) => repository.insert(e))),
    map(() => undefined),
  );
}

export const switchToPersisted =
  <Entity>(database: EntityDatabase<Entity, any>) =>
  (source: Observable<Entity>): Observable<Entity> =>
    source.pipe(
      switchMap((entity) => database.persist(entity).pipe(map(() => entity))),
    );

export const switchToAllPersisted =
  <Entity>(database: EntityDatabase<Entity, any>) =>
  (source: Observable<Entity[]>): Observable<Entity[]> =>
    source.pipe(
      map((entities) =>
        entities.map((e) => database.persist(e).pipe(map(() => e))),
      ),
      switchMap((streams) =>
        streams.length ? combineLatest(streams) : of([]),
      ),
    );
