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
      concatMap((params) => {
        const action$ = params.mail.isStarred
          ? this.mailService.markMailAsNotStarred(params.mail)
          : this.mailService.markMailAsStarred(params.mail);
        return action$.pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(A.toggleMailStarredStatus),
              filter((a) => a.mail.id === params.mail.id),
            ),
          ),
          map((result) =>
            A.toggleMailStarredStatusCompleted({ params, result }),
          ),
          catchError((error) =>
            of(A.toggleMailStarredStatusFailed({ params, error })),
          ),
        );
      }),
    ),
  );

  toggleMailStarredStatusRetryUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailStarredStatusFailed),
      switchMap(({ params: { mail } }) =>
        this.notifier
          .notify('Failed to update starred status', 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            map(() => A.toggleMailStarredStatus({ mail })),
          ),
      ),
    ),
  );

  toggleMailReadStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailReadStatus),
      concatMap((params) => {
        const target = params.mail.isRead ? 'unread' : 'read';
        const action$ =
          target === 'read'
            ? this.mailService.markMailAsRead(params.mail)
            : this.mailService.markMailAsUnread(params.mail);
        return action$.pipe(
          map((result) => A.toggleMailReadStatusCompleted({ params, result })),
          catchError((error) =>
            of(A.toggleMailReadStatusFailed({ params, error })),
          ),
        );
      }),
    ),
  );

  toggleMailReadStatusRetryUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailReadStatusFailed),
      switchMap(({ params }) => {
        const target = params.mail.isRead ? 'unread' : 'read';
        return this.notifier
          .notify(`Failed to mark mail as ${target}`, 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            map(() => A.toggleMailReadStatus(params)),
          );
      }),
    ),
  );
}
