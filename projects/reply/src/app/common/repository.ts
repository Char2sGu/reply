import { combineLatest, Observable } from 'rxjs';

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
