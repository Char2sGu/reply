import { map, Observable, tap } from 'rxjs';

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
