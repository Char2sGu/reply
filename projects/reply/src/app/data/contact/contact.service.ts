import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  first,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { AuthenticationService } from '@/app/core/auth/authentication.service';
import { Exception } from '@/app/core/exceptions';

import { BackendSyncApplier } from '../core/backend-sync-applier.service';
import {
  switchMapToAllRecorded,
  switchMapToRecorded,
} from '../core/reactive-repository.utils';
import { ContactBackend } from './contact.backend';
import { Contact } from './contact.model';
import { ContactRepository } from './contact.repository';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private backend = inject(ContactBackend);
  private repo = inject(ContactRepository);
  private authService = inject(AuthenticationService);
  private syncApplier = inject(BackendSyncApplier);

  private syncToken$ = new BehaviorSubject<string | null>(null);

  readonly user$ = this.authService.authorization$.pipe(
    switchMap((auth) => (auth ? this.backend.loadUser() : of(null))),
    shareReplay(1),
  );

  // TODO: load other pages
  loadContacts(): Observable<Contact[]> {
    const results$ = this.backend
      .loadContacts()
      .pipe(switchMapToAllRecorded(this.repo));
    return this.backend.obtainSyncToken().pipe(
      tap((token) => this.syncToken$.next(token)),
      switchMap(() => results$),
    );
  }

  loadContact(id: Contact['id']): Observable<Contact> {
    return this.backend.loadContact(id).pipe(switchMapToRecorded(this.repo));
  }

  searchContactsByEmail(email: string): Observable<Contact[]> {
    return this.backend
      .searchContactsByEmail(email)
      .pipe(switchMapToAllRecorded(this.repo));
  }

  syncContacts(): Observable<void> {
    return this.syncToken$.pipe(
      first(),
      switchMap((syncToken) => {
        if (!syncToken)
          return throwError(() => new ContactSyncTokenMissingException());
        return this.backend.syncContacts(syncToken);
      }),
      tap((result) => this.syncToken$.next(result.syncToken)),
      tap((result) => this.syncApplier.applyChanges(this.repo, result.changes)),
      map(() => undefined),
    );
  }
}

export class ContactServiceException extends Exception {}
export class ContactSyncTokenMissingException extends ContactServiceException {}
