import {
  catchError,
  combineLatest,
  map,
  of,
  OperatorFunction,
  switchMap,
} from 'rxjs';

import {
  ReactiveRepository,
  ReactiveRepositoryUpdate,
} from './reactive-repository';

export const switchMapToRecorded =
  <Entity>(
    repo: ReactiveRepository<Entity>,
  ): OperatorFunction<Entity, Entity> =>
  (source) =>
    source.pipe(switchMap((entity) => repo.record(entity)));

export const switchMapToAllRecorded =
  <Entity>(
    repo: ReactiveRepository<Entity>,
  ): OperatorFunction<Entity[], Entity[]> =>
  (source) =>
    source.pipe(
      map((entities) => entities.map((e) => repo.record(e))),
      switchMap((streams) =>
        streams.length ? combineLatest(streams) : of([]),
      ),
    );

export const onErrorUndo =
  <Update extends ReactiveRepositoryUpdate<any>, T>(
    update: Update,
  ): OperatorFunction<T, T> =>
  (source) =>
    source.pipe(
      catchError((err) => {
        update.undo();
        throw err;
      }),
    );
