import { combineLatest, Observable } from 'rxjs';

import { EntityNotFoundException } from '../core/exceptions';
import { ReactiveIdentityMap } from './reactivity';

export abstract class ReactiveRepository<Entity> {
  protected reactivity = new ReactiveIdentityMap<Entity>();

  protected abstract identify(entity: Entity): string;

  protected reactivityFor(entity: Entity): Observable<Entity> {
    const id = this.identify(entity);
    this.reactivity.set(id, entity);
    return this.reactivity.get(id);
  }

  protected reactivityForAll(entities: Entity[]): Observable<Entity[]> {
    const streams = entities.map((entity) => this.reactivityFor(entity));
    return combineLatest(streams);
  }
}

export class EntityCollection<T> extends Array<T> {
  findOrThrow(predicate: (value: T) => unknown): T {
    const result = this.find(predicate);
    if (!result) throw new EntityNotFoundException();
    return result;
  }

  findIndexOrThrow(predicate: (value: T) => unknown): number {
    const result = this.findIndex(predicate);
    if (result === -1) throw new EntityNotFoundException();
    return result;
  }

  remove(predicate: (value: T) => unknown): void {
    const index = this.findIndexOrThrow(predicate);
    this.splice(index, 1);
  }

  update(predicate: (value: T) => unknown, executor: (prev: T) => T): T {
    const index = this.findIndexOrThrow(predicate);
    this[index] = executor(this[index]);
    return this[index];
  }
}
