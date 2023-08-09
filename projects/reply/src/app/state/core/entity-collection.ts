import { Exception } from '@/app/core/exceptions';

export class EntityCollection<Entity> {
  constructor(
    private identifier: (entity: Entity) => string,
    private entities: Record<string, Entity> = {},
  ) {}

  identify(entity: Entity): string {
    return this.identifier(entity);
  }

  all(): Entity[] {
    return Object.values(this.entities);
  }

  retrieve(id: string): Entity {
    const entity = this.entities[id];
    if (!entity) throw new EntityNotFoundException(id);
    return entity;
  }

  query(predicate: (entity: Entity) => boolean): Entity[] {
    return this.all().filter(predicate);
  }

  queryOne(predicate: (entity: Entity) => boolean): Entity | null {
    return this.all().find(predicate) ?? null;
  }

  insert(...entities: Entity[]): EntityCollection<Entity> {
    const inserted = entities.reduce((acc, entity) => {
      const id = this.identify(entity);
      if (id in acc) throw new EntityDuplicateException(id, entity);
      return { ...acc, [id]: entity };
    }, {});
    const entitiesAll = { ...this.entities, ...inserted };
    return new EntityCollection(this.identifier, entitiesAll);
  }

  update(id: string, payload: Partial<Entity>): EntityCollection<Entity> {
    const original = this.entities[id];
    if (!original) throw new EntityNotFoundException(id);
    const updated = { ...original, ...payload };
    const entities = { ...this.entities, [id]: updated };
    return new EntityCollection(this.identifier, entities);
  }

  upsert(...entities: Entity[]): EntityCollection<Entity> {
    const entitiesAll = entities.reduce((acc, entity) => {
      const id = this.identify(entity);
      return { ...acc, [id]: entity };
    }, this.entities);
    return new EntityCollection(this.identifier, entitiesAll);
  }

  delete(...ids: string[]): EntityCollection<Entity> {
    const entities = { ...this.entities };
    ids.forEach((id) => {
      if (!(id in entities)) throw new EntityNotFoundException(id);
      delete entities[id];
    });
    return new EntityCollection(this.identifier, entities);
  }

  ['toString'](): string {
    return JSON.stringify(this.entities);
  }

  ['toJSON'](): Record<string, Entity> {
    return this.entities;
  }
}

export class EntityCollectionException extends Exception {}

export class EntityDuplicateException extends EntityCollectionException {
  constructor(id: string, entity: unknown) {
    const stringified = JSON.stringify(entity);
    const msg = `Entity duplicate\nIdentity: ${id}\nEntity: ${stringified}`;
    super(msg);
  }
}

export class EntityNotFoundException extends EntityCollectionException {
  constructor(id: string) {
    const msg = `Entity not found\nIdentity: ${id}`;
    super(msg);
  }
}
