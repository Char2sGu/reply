import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs';

import { NotificationService } from '@/app/core/notification/notification.service';
import { MAILBOX_STATE } from '@/app/state/mailbox/mailbox.state-entry';

import { MAIL_ACTIONS as A } from './mail.actions';

@Injectable()
export class MailNotificationEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private notifier = inject(NotificationService);

  [A.toggleMailStarredStatusFailed.type] = createEffect(() =>
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

  [A.toggleMailReadStatusFailed.type] = createEffect(() =>
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

  [A.moveMailToMailbox.type] = createEffect(() =>
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

  [A.moveMailToMailboxFailed.type] = createEffect(() =>
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

  [A.deleteMail.type] = createEffect(
    () =>
      this.actions$.pipe(
        ofType(A.deleteMail),
        tap(() => this.notifier.notify('Mail deleted permanently')),
        map(() => null),
      ),
    { dispatch: false },
  );

  [A.deleteMailFailed.type] = createEffect(() =>
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
