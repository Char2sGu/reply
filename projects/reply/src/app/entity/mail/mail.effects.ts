import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  EMPTY,
  exhaustMap,
  filter,
  firstValueFrom,
  map,
  of,
  switchMap,
  takeUntil,
  timer,
  withLatestFrom,
} from 'rxjs';

import { MAIL_STATE } from '@/app/state/mail/mail.state-entry';

import { MAIL_ACTIONS as A } from './mail.actions';
import { MailService } from './mail.service';
import { MailSyncService } from './mail-sync.service';

@Injectable()
export class MailEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private mailService = inject(MailService);
  private mailSyncService = inject(MailSyncService);

  [A.loadMails.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadMails),
      exhaustMap(async () => {
        try {
          const syncToken$ = this.mailSyncService.obtainSyncToken();
          const syncToken = await firstValueFrom(syncToken$);
          const mailPage$ = this.mailService.loadMailPage();
          const mailPage = await firstValueFrom(mailPage$);
          const mails = mailPage.results;
          return A.loadMailsCompleted({ result: { mails, syncToken } });
        } catch (error) {
          return A.loadMailsFailed({ error });
        }
      }),
    ),
  );

  [A.toggleMailStarredStatus.type] = createEffect(() =>
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
              filter(({ mail }) => mail.id === params.mail.id),
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

  [A.toggleMailReadStatus.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.toggleMailReadStatus),
      concatMap((params) => {
        const target = params.mail.isRead ? 'unread' : 'read';
        const action$ =
          target === 'read'
            ? this.mailService.markMailAsRead(params.mail)
            : this.mailService.markMailAsUnread(params.mail);
        return action$.pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(A.toggleMailReadStatus),
              filter(({ mail }) => mail.id === params.mail.id),
            ),
          ),
          map((result) => A.toggleMailReadStatusCompleted({ params, result })),
          catchError((error) =>
            of(A.toggleMailReadStatusFailed({ params, error })),
          ),
        );
      }),
    ),
  );

  [A.moveMailToMailbox.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.moveMailToMailbox),
      concatMap((params) =>
        this.mailService.moveMail(params.mail, params.mailbox).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(A.moveMailToMailbox),
              filter(({ mail }) => mail.id === params.mail.id),
            ),
          ),
          map((result) => A.moveMailToMailboxCompleted({ params, result })),
          catchError((error) =>
            of(A.moveMailToMailboxFailed({ params, error })),
          ),
        ),
      ),
    ),
  );

  [A.deleteMail.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteMail),
      concatMap((params) =>
        this.mailService.deleteMail(params.mail).pipe(
          map(() => A.deleteMailCompleted({ params })),
          catchError((error) => of(A.deleteMailFailed({ params, error }))),
        ),
      ),
    ),
  );

  [A.syncMailChanges.type] = createEffect(() =>
    this.actions$.pipe(
      ofType(A.syncMailChanges),
      withLatestFrom(this.store.select(MAIL_STATE.selectSyncToken)),
      exhaustMap(([, syncToken]) => {
        if (!syncToken) return EMPTY;
        return this.mailSyncService.syncChanges(syncToken).pipe(
          map((result) => A.syncMailChangesCompleted({ result })),
          catchError((error) => of(A.syncMailChangesFailed({ error }))),
        );
      }),
    ),
  );

  syncMailChangesAtIntervalsAfterMailsLoaded = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadMailsCompleted),
      switchMap(() =>
        timer(1000 * 60, 1000 * 60).pipe(map(() => A.syncMailChanges())),
      ),
    ),
  );
}
