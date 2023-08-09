import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

import { NotificationService } from '@/app/core/notification/notification.service';
import { MailBackend } from '@/app/entity/mail/mail.backend';

import { MAIL_ACTIONS as A } from './mail.actions';

@Injectable()
export class MailEffects {
  private actions$ = inject(Actions);
  private mailService = inject(MailBackend);
  private notifier = inject(NotificationService);

  loadMails = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadMails),
      concatMap(() =>
        this.mailService.loadMailPage().pipe(
          map((r) => r.results),
          map((result) => A.loadMailsCompleted({ result })),
          catchError((error) => of(A.loadMailsFailed({ error }))),
        ),
      ),
    ),
  );

  toggleMailStarredStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailStarredStatus),
      concatMap(({ mail }) => {
        const action$ = mail.isStarred
          ? this.mailService.markMailAsNotStarred(mail)
          : this.mailService.markMailAsStarred(mail);
        return action$.pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(A.toggleMailStarredStatus),
              filter((a) => a.mail.id === mail.id),
            ),
          ),
          map((result) => A.toggleMailStarredStatusCompleted({ mail, result })),
          catchError((error) =>
            of(A.toggleMailStarredStatusFailed({ mail, error })),
          ),
        );
      }),
    ),
  );

  toggleMailStarredStatusRetryUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailStarredStatusFailed),
      switchMap(({ mail }) =>
        this.notifier
          .notify('Failed to update starred status', 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            map(() => A.toggleMailStarredStatus({ mail })),
          ),
      ),
    ),
  );
}
