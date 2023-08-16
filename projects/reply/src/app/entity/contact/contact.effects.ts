import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { ContactService } from '@/app/entity/contact/contact.service';

import { CONTACT_ACTIONS } from './contact.actions';

@Injectable()
export class ContactEffects {
  private actions$ = inject(Actions);
  private contactService = inject(ContactService);

  loadContacts = createEffect(() =>
    this.actions$.pipe(
      ofType(CONTACT_ACTIONS.loadContacts),
      exhaustMap(() =>
        this.contactService.loadContacts().pipe(
          map((result) => CONTACT_ACTIONS.loadContactsCompleted({ result })),
          catchError((error) =>
            of(CONTACT_ACTIONS.loadContactsFailed({ error })),
          ),
        ),
      ),
    ),
  );
}
