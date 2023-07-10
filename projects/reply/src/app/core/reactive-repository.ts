import {
  BehaviorSubject,
  filter,
  InteropObservable,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  tap,
} from 'rxjs';

import {
  EntityDuplicateException,
  EntityNotFoundException,
} from './exceptions';

export abstract class ReactiveRepository<Entity> {
  protected updatesSubject = new Subject<ReactiveRepositoryUpdate<Entity>>();
  readonly updates$ = this.updatesSubject.asObservable();

  protected entities = new Map<string, BehaviorSubject<Entity>>();

  abstract identify(entity: Entity): string;

  query(
    condition: (entity: Entity) => boolean = () => true,
  ): Observable<Entity[]> {
    const results = new Set<string>();
    for (const [id, entity] of this.entities)
      if (condition(entity.value)) results.add(id);

    return this.updates$.pipe(
      tap((update) => {
        if (update.curr && condition(update.curr)) results.add(update.id);
        else results.delete(update.id);
      }),
      startWith(null),
      map(() =>
        [...results].map((id) => {
          const entity = this.entities.get(id);
          if (!entity) throw new Error('Entity in results but missing');
          return entity.value;
        }),
      ),
      shareReplay(1),
    );
  }

  retrieve(id: string): Observable<Entity> {
    const entity = this.entities.get(id);
    if (!entity) throw new EntityNotFoundException();
    return entity;
  }

  insert(entity: Entity): ReactiveRepositoryUpdate<Entity> {
    const id = this.identify(entity);
    if (this.entities.has(id)) throw new EntityDuplicateException();
    const entity$ = new BehaviorSubject(entity);
    this.entities.set(id, entity$);
    return this.createUpdate({
      id,
      prev: null,
      curr: entity,
      entity$,
      undo: () => this.delete(id),
    });
  }

  patch(
    id: string,
    payload: Partial<Entity>,
  ): ReactiveRepositoryUpdate<Entity> {
    const entity$ = this.entities.get(id);
    if (!entity$) throw new EntityNotFoundException();
    const prev = entity$.value;
    entity$.next({ ...prev, ...payload });
    return this.createUpdate({
      id,
      prev,
      curr: entity$.value,
      entity$,
      undo: () => this.patch(id, prev),
    });
  }

  insertOrPatch(entity: Entity): ReactiveRepositoryUpdate<Entity> {
    const id = this.identify(entity);
    const existing = this.entities.get(id);
    if (existing) return this.patch(id, entity);
    return this.insert(entity);
  }

  delete(id: string): ReactiveRepositoryUpdate<Entity> {
    const entity$ = this.entities.get(id);
    if (!entity$) throw new EntityNotFoundException();
    const prev = entity$.value;
    entity$.complete();
    this.entities.delete(id);
    return this.createUpdate({
      id,
      prev,
      curr: null,
      entity$,
      undo: () => this.insert(prev),
    });
  }

  exists(id: string): Observable<boolean> {
    let result = this.entities.has(id);
    return this.updates$.pipe(
      filter((u) => u.id === id),
      tap((update) => {
        if (update.curr === null) result = false;
        else result = true;
      }),
      startWith(null),
      map(() => result),
    );
  }

  private createUpdate(
    fields: Omit<ReactiveRepositoryUpdate<Entity>, symbol>,
  ): ReactiveRepositoryUpdate<Entity> {
    const update = { ...fields, [Symbol.observable]: () => fields.entity$ };
    this.updatesSubject.next(update);
    return update;
  }
}

export interface ReactiveRepositoryUpdate<Entity>
  extends InteropObservable<Entity> {
  readonly id: string;
  readonly prev: Entity | null;
  readonly curr: Entity | null;
  readonly entity$: Observable<Entity>;
  undo(): ReactiveRepositoryUpdate<Entity>;
}
