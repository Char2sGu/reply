import { Injectable } from '@angular/core';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { ReactiveRepository } from '../core/reactive-repository';
import { Contact } from './contact.model';

// TODO: try avoid syncing between entities

@Injectable({
  providedIn: 'root',
})
export class ContactRepository extends ReactiveRepository<Contact> {
  constructor() {
    super();
    const creation$ = this.update$.pipe(
      filter((update) => !!update.curr && !update.prev),
      map((u) => u.id),
    );
    creation$.subscribe((id) => {
      this.retrieve(id)
        .pipe(
          filter((c) => !c.temporary),
          switchMap((contact) => this.syncTemporaryAlternatives(contact)),
        )
        .subscribe();
    });
  }

  identify(entity: Contact): string {
    return entity.id;
  }

  private syncTemporaryAlternatives(contact: Contact): Observable<void> {
    return this.query((e) => e.temporary && e.email === contact.email).pipe(
      tap((alternatives) =>
        alternatives.forEach((alternative) => {
          const { id, temporary, ...fields } = contact;
          this.patch(alternative.id, fields);
        }),
      ),
      map(() => undefined),
    );
  }
}
