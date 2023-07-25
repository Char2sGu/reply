import { catchError, OperatorFunction } from 'rxjs';

import { ReactiveRepositoryUpdate } from './reactive-repository';

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
