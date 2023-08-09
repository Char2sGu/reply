import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { from, Observable } from 'rxjs';

@Injectable()
export abstract class EntityDatabase<T, K> {
  abstract list(): Observable<T[]>;
  abstract persist(entity: T): Observable<K>;
  abstract delete(key: K): Observable<void>;
  abstract clear(): Observable<void>;
}

@Injectable()
export abstract class DexieEntityDatabase<T, K> extends EntityDatabase<T, K> {
  protected abstract readonly table: Dexie.Table<T, K>;
  list(): Observable<T[]> {
    return from(this.table.toArray());
  }
  persist(entity: T): Observable<K> {
    return from(this.table.put(entity));
  }
  delete(key: K): Observable<void> {
    return from(this.table.delete(key));
  }
  clear(): Observable<void> {
    return from(this.table.clear());
  }
}
