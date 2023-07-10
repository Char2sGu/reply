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

/**
 * A reactive repository serves as the one and only source of truth for any
 * entities of a given type.
 */
export abstract class ReactiveRepository<Entity> {
  protected updatesSubject = new Subject<ReactiveRepositoryUpdate<Entity>>();
  readonly updates$ = this.updatesSubject.asObservable();

  protected entities = new Map<string, BehaviorSubject<Entity>>();

  /**
   * @returns A unique identifier for the given entity, usually `entity.id`.
   */
  abstract identify(entity: Entity): string;

  /**
   * @returns An observable of all entities matching the given condition. A new
   * value is emitted whenever an {@link insert}, {@link patch}, or
   * {@link delete} operation is performed on an entity matching the condition.
   */
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

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   * @returns An observable of the entity with the given id. A new value is
   * emitted when the entity is updated; the observable completes when the
   * entity is deleted.
   */
  retrieve(id: string): Observable<Entity> {
    const entity = this.entities.get(id);
    if (!entity) throw new EntityNotFoundException();
    return entity;
  }

  /**
   * @throws An {@link EntityDuplicateException} if entity with the same id
   * already exists.
   */
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

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   */
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

  /**
   * {@link insert Insert} the entity if it doesn't exist, otherwise
   * {@link patch} the existing one.
   */
  insertOrPatch(entity: Entity): ReactiveRepositoryUpdate<Entity> {
    const id = this.identify(entity);
    const existing = this.entities.get(id);
    if (existing) return this.patch(id, entity);
    return this.insert(entity);
  }

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   */
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

  /**
   * @returns An observable of whether an entity with the given id exists. A new
   * value is emitted when the result is updated.
   */
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

/**
 * An update to an entity in a {@link ReactiveRepository}. This object is
 * observable-interoperable: subscribing to it is equivalent to subscribing to
 * the {@link entity$} property.
 */
export interface ReactiveRepositoryUpdate<Entity>
  extends InteropObservable<Entity> {
  readonly id: string;
  readonly prev: Entity | null;
  readonly curr: Entity | null;

  /**
   * An observable of the target entity. A new value is emitted when the entity
   * is updated; the observable completes when the entity is deleted.
   */
  readonly entity$: Observable<Entity>;

  /**
   * Perform another operation aiming to undo the operation that caused this
   * update.
   */
  undo(): ReactiveRepositoryUpdate<Entity>;
}
