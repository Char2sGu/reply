import { EventEmitter } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  InteropObservable,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

import { PropertiesNonNullable } from '../../core/property.utils';
import {
  EntityDuplicateException,
  EntityNotFoundException,
} from './reactive-repository.exceptions';

/**
 * A reactive repository serves as the one and only source of truth for any
 * entities of a given type.
 */
export abstract class ReactiveRepository<Entity> {
  protected update = new EventEmitter<ReactiveRepositoryUpdate<Entity>>();
  readonly update$ = this.update.asObservable();

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
  ): ObservableWithSnapshot<Entity[]> {
    const results = new Set<string>();
    for (const [id, entity] of this.entities)
      if (condition(entity.value)) results.add(id);

    const resolveResults = () =>
      [...results].map((id) => {
        const entity = this.entities.get(id);
        if (!entity) throw new Error('Entity in results but missing');
        return entity.value;
      });

    const snapshot = resolveResults();

    const observable = this.update$.pipe(
      map((update) => {
        if (update.curr && condition(update.curr)) {
          results.add(update.id);
          return true;
        }
        return results.delete(update.id);
      }),
      filter(Boolean),
      map(resolveResults),
      startWith(snapshot),
      shareReplay(1),
    );

    return Object.assign(observable, { snapshot });
  }

  /**
   * @returns An observable of the first entity matching the given condition
   * or null. A new value is emitted when the query result is updated.
   */
  queryOne(
    condition: (entity: Entity) => boolean = () => true,
  ): ObservableWithSnapshot<Entity | null> {
    const results$ = this.query(condition);
    const resolveResults = (entities: Entity[]) => entities[0] ?? null;
    const observable = results$.pipe(map(resolveResults), shareReplay(1));
    const snapshot = resolveResults(results$.snapshot);
    return Object.assign(observable, { snapshot });
  }

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   * @returns An observable of the entity with the given id. A new value is
   * emitted when the entity is updated; the observable completes when the
   * entity is deleted.
   */
  retrieve(id: string): ObservableWithSnapshot<Entity> {
    const entity$ = this.entities.get(id);
    if (!entity$) throw new EntityNotFoundException();
    return Object.assign(entity$, { snapshot: entity$.value });
  }

  /**
   * @throws An {@link EntityDuplicateException} if entity with the same id
   * already exists.
   */
  insert(
    entity: Entity,
  ): PropertiesNonNullable<ReactiveRepositoryUpdate<Entity>, 'curr'> {
    const id = this.identify(entity);
    if (this.entities.has(id)) throw new EntityDuplicateException();
    const entity$ = new BehaviorSubject(entity);
    this.entities.set(id, entity$);
    return this.performUpdate({
      id,
      prev: null,
      curr: entity,
      undo: () => this.delete(id),
    }) as any;
  }

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   */
  patch(
    id: string,
    payload: Partial<Entity>,
  ): PropertiesNonNullable<ReactiveRepositoryUpdate<Entity>, 'prev' | 'curr'> {
    const entity$ = this.entities.get(id);
    if (!entity$) throw new EntityNotFoundException();
    const prev = entity$.value;
    entity$.next({ ...prev, ...payload });
    return this.performUpdate({
      id,
      prev,
      curr: entity$.value,
      undo: () => this.patch(id, prev),
    }) as any;
  }

  /**
   * {@link insert Insert} the entity if it doesn't exist, otherwise
   * {@link patch} the existing one.
   */
  record(
    entity: Entity,
  ): PropertiesNonNullable<ReactiveRepositoryUpdate<Entity>, 'curr'> {
    const id = this.identify(entity);
    const existing = this.entities.get(id);
    if (existing) return this.patch(id, entity);
    return this.insert(entity);
  }

  /**
   * @throws An {@link EntityNotFoundException} if entity with the given id
   * doesn't exist.
   */
  delete(
    id: string,
  ): PropertiesNonNullable<ReactiveRepositoryUpdate<Entity>, 'prev'> {
    const entity$ = this.entities.get(id);
    if (!entity$) throw new EntityNotFoundException();
    const prev = entity$.value;
    entity$.complete();
    this.entities.delete(id);
    return this.performUpdate({
      id,
      prev,
      curr: null,
      undo: () => this.insert(prev),
    }) as any;
  }

  private performUpdate(
    fields: Omit<ReactiveRepositoryUpdate<Entity>, symbol>,
  ): ReactiveRepositoryUpdate<Entity> {
    const update = {
      ...fields,
      [Symbol.observable]: () => this.retrieve(fields.id),
    };
    this.update.emit(update);
    return update;
  }
}

/**
 * An update to an entity in a {@link ReactiveRepository}. This object is
 * observable-interoperable: subscribing to it is equivalent to subscribing to
 * the target entity.
 */
export interface ReactiveRepositoryUpdate<Entity>
  extends InteropObservable<Entity> {
  readonly id: string;
  readonly prev: Entity | null;
  readonly curr: Entity | null;

  /**
   * Perform another operation aiming to undo the operation that caused this
   * update.
   */
  undo(): ReactiveRepositoryUpdate<Entity>;
}

interface ObservableWithSnapshot<T> extends Observable<T> {
  snapshot: T;
}
