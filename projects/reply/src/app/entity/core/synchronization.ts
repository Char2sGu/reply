import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class SyncService<Entity> {
  abstract obtainSyncToken(): Observable<string>;
  abstract syncChanges(syncToken: string): Observable<SyncResult<Entity>>;
}

export interface SyncResult<Entity> {
  changes: SyncChange<Entity>[];
  syncToken: string;
}

export type SyncChange<Entity> =
  | SyncDeletion
  | SyncCreation<Entity>
  | SyncUpdate<Entity>
  | SyncCreationOrUpdate<Entity>;

export interface SyncDeletion {
  type: 'deletion';
  id: string;
}
export interface SyncCreation<Entity> {
  type: 'creation';
  id: string;
  payload: Entity;
}
export interface SyncUpdate<Entity> {
  type: 'update';
  id: string;
  payload: Partial<Entity>;
}
export interface SyncCreationOrUpdate<Entity> {
  type: 'creation-or-update';
  id: string;
  payload: Entity;
}
