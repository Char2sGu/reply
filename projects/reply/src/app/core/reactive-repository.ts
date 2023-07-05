import {
  BehaviorSubject,
  filter,
  map,
  Observable,
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
  updates$ = this.updatesSubject.asObservable();

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
        if (update.curr === null) results.delete(update.id);
        else if (condition(update.curr)) results.add(update.id);
      }),
      startWith(null),
      map(() =>
        [...results].map((id) => {
          const entity = this.entities.get(id);
          if (!entity) throw new Error('Entity in results but missing');
          return entity.value;
        }),
      ),
    );
  }

  retrieve(id: string): Observable<Entity> {
    const entity = this.entities.get(id);
    if (!entity) throw new EntityNotFoundException();
    return entity;
  }

  insert(entity: Entity): Observable<Entity> {
    const id = this.identify(entity);
    if (this.entities.has(id)) throw new EntityDuplicateException();
    const subject = new BehaviorSubject(entity);
    this.entities.set(id, subject);
    this.updatesSubject.next({ id, prev: null, curr: entity });
    return subject;
  }

  patch(id: string, payload: Partial<Entity>): Observable<Entity> {
    const entity = this.entities.get(id);
    if (!entity) throw new EntityNotFoundException();
    const prev = entity.value;
    entity.next({ ...prev, ...payload });
    this.updatesSubject.next({ id, prev, curr: entity.value });
    return entity;
  }

  insertOrPatch(entity: Entity): Observable<Entity> {
    const id = this.identify(entity);
    const existing = this.entities.get(id);
    if (existing) return this.patch(id, entity);
    return this.insert(entity);
  }

  delete(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) throw new EntityNotFoundException();
    entity.complete();
    this.entities.delete(id);
    this.updatesSubject.next({ id, prev: entity.value, curr: null });
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
}

export interface ReactiveRepositoryUpdate<Entity> {
  id: string;
  prev: Entity | null;
  curr: Entity | null;
}
