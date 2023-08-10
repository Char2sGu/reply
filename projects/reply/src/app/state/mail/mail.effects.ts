import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

import { NotificationService } from '@/app/core/notification/notification.service';
import { MailService } from '@/app/entity/mail/mail.service';

import { MAILBOX_STATE } from '../mailbox/mailbox.state-entry';
import { MAIL_ACTIONS as A } from './mail.actions';

@Injectable()
export class MailEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private mailService = inject(MailService);
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

  moveMailToMailbox = createEffect(() =>
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

  moveMailToMailboxNotifyUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.moveMailToMailbox),
      withLatestFrom(this.store.select(MAILBOX_STATE.selectMailboxes)),
      switchMap(([params, mailboxes]) => {
        const { mail, mailbox: destMailbox } = params;
        const currMailbox = mail.mailbox
          ? mailboxes.retrieve(mail.mailbox)
          : null;
        const msg = destMailbox
          ? `Mail moved into ${destMailbox.name}`
          : currMailbox
          ? `Mail moved out from ${currMailbox.name}`
          : 'Mail moved';
        return this.notifier.notify(msg, 'Undo').event$.pipe(
          filter((e) => e.type === 'action'),
          map(() =>
            A.moveMailToMailbox({
              mail: { ...mail, mailbox: destMailbox?.id },
              mailbox: currMailbox,
            }),
          ),
        );
      }),
    ),
  );

  moveMailToMailboxRetryUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.moveMailToMailboxFailed),
      withLatestFrom(this.store.select(MAILBOX_STATE.selectMailboxes)),
      switchMap(([{ params }, mailboxes]) => {
        const { mail, mailbox: destMailbox } = params;
        const currMailbox = mail.mailbox
          ? mailboxes.retrieve(mail.mailbox)
          : null;
        const msg = destMailbox
          ? `Failed to move mail into ${destMailbox.name}`
          : currMailbox
          ? `Failed to move mail out from ${currMailbox.name}`
          : 'Failed to move mail';
        return this.notifier
          .notify(msg, 'Retry')
          .event$.pipe(map(() => A.moveMailToMailbox(params)));
      }),
    ),
  );

  deleteMail = createEffect(() =>
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

  deleteMailNotifyUi = createEffect(
    () =>
      this.actions$.pipe(
        ofType(A.deleteMail),
        tap(() => this.notifier.notify('Mail deleted permanently')),
        map(() => null),
      ),
    { dispatch: false },
  );

  deleteMailRetryUi = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteMailFailed),
      switchMap(({ params }) =>
        this.notifier.notify('Failed to delete mail', 'Retry').event$.pipe(
          filter((e) => e.type === 'action'),
          map(() => A.deleteMail(params)),
        ),
      ),
    ),
  );
}
