import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  EMPTY,
  exhaustMap,
  firstValueFrom,
  map,
  of,
  switchMap,
  timer,
  withLatestFrom,
} from 'rxjs';

import { ContactService } from '@/app/entity/contact/contact.service';
import { CONTACT_STATE } from '@/app/state/contact/contact.state-entry';

import { CONTACT_ACTIONS as A } from './contact.actions';
import { ContactSyncService } from './contact-sync.service';

@Injectable()
export class ContactEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private contactService = inject(ContactService);
  private contactSyncService = inject(ContactSyncService);

  [A.loadContacts.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadContacts),
      exhaustMap(async () => {
        try {
          const syncToken$ = this.contactSyncService.obtainSyncToken();
          const syncToken = await firstValueFrom(syncToken$);
          const contacts$ = this.contactService.loadContacts();
          const contacts = await firstValueFrom(contacts$);
          const results = contacts;
          return A.loadContactsCompleted({ result: { results, syncToken } });
        } catch (error) {
          return A.loadContactsFailed({ error });
        }
      }),
    ),
  );

  [A.syncContactChanges.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.syncContactChanges),
      withLatestFrom(this.store.select(CONTACT_STATE.selectSyncToken)),
      exhaustMap(([, syncToken]) => {
        if (!syncToken) return EMPTY;
        return this.contactSyncService.syncChanges(syncToken).pipe(
          map((result) => A.syncContactChangesCompleted({ result })),
          catchError((error) => of(A.syncContactChangesFailed({ error }))),
        );
      }),
    ),
  );

  syncContactChangesAtIntervalsAfterContactsLoaded = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadContactsCompleted),
      switchMap(() =>
        timer(1000 * 60, 1000 * 60).pipe(map(() => A.syncContactChanges())),
      ),
    ),
  );
}
