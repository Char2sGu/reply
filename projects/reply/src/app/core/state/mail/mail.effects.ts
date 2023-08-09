import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';

import { MailBackend } from '@/app/entity/mail/mail.backend';

import { MAIL_ACTIONS } from './mail.actions';

@Injectable()
export class MailEffects {
  private actions$ = inject(Actions);
  private mailService = inject(MailBackend);

  loadMails = createEffect(() =>
    this.actions$.pipe(
      ofType(MAIL_ACTIONS.loadMails),
      concatMap(() => this.mailService.loadMailPage()),
      map((r) => r.results),
      map((result) => MAIL_ACTIONS.loadMailsCompleted({ result })),
      catchError((error) => of(MAIL_ACTIONS.loadMailsFailed({ error }))),
    ),
  );
}
