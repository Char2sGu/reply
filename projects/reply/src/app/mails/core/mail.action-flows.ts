import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  filter,
  first,
  map,
  merge,
  Observable,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

import { ActionFlow, useActionFlow } from '@/app/core/action-flow';
import { NotificationService } from '@/app/core/notification/notification.service';
import { PopupService } from '@/app/core/popup/popup.service';
import { MailConductor } from '@/app/data/mail/mail.conductor';
import { Mail } from '@/app/data/mail/mail.model';
import { MailRepository } from '@/app/data/mail/mail.repository';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox/mailbox.repository';

import { MailboxSelectionPopupComponent } from './mailbox-selection-popup/mailbox-selection-popup.component';

@Injectable({
  providedIn: 'root',
})
export class ToggleMailStarredStatusActionFlow implements ActionFlow {
  private mailConductor = inject(MailConductor);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail }): Observable<void> {
    const action$ = payload.mail.isStarred
      ? this.mailConductor.markMailAsNotStarred(payload.mail)
      : this.mailConductor.markMailAsStarred(payload.mail);
    return action$.pipe(
      catchError((err, caught) =>
        this.notifier
          .notify('Failed to update starred status', 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            switchMap(() => caught),
          ),
      ),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ToggleMailReadStatusActionFlow implements ActionFlow {
  private mailConductor = inject(MailConductor);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail; to?: 'read' | 'unread' }): Observable<void> {
    const targetStatus =
      payload.to ?? (payload.mail.isRead ? 'unread' : 'read');
    const action$ =
      targetStatus === 'read'
        ? this.mailConductor.markMailAsRead(payload.mail)
        : this.mailConductor.markMailAsUnread(payload.mail);
    return action$.pipe(
      catchError((err, caught) =>
        this.notifier
          .notify(`Failed to mark mail as ${targetStatus}`, 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            switchMap(() => caught),
          ),
      ),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class MoveMailActionFlow implements ActionFlow {
  private popupService = inject(PopupService);
  private moveMailToMailbox = useActionFlow(MoveMailToMailboxActionFlow);

  execute(payload: { mail: Mail; currentMailbox?: Mailbox }): Observable<void> {
    const popupRef = this.popupService.popupDialog(
      MailboxSelectionPopupComponent, //
      { title: 'Move to', current: payload.currentMailbox },
    );
    return popupRef.event$.pipe(
      map((e) => (e.type === 'output' ? e.payload : null)),
      filter(Boolean),
      switchMap((mailbox) =>
        this.moveMailToMailbox({ mail: payload.mail, mailbox }),
      ),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class MoveMailToMailboxActionFlow implements ActionFlow {
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);
  private mailConductor = inject(MailConductor);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail; mailbox: Mailbox | null }): Observable<void> {
    const currentMailbox$: Observable<Mailbox | null> = payload.mail.mailbox
      ? this.mailboxRepo.retrieve(payload.mail.mailbox).pipe(first())
      : of(null);

    const undo$ = currentMailbox$.pipe(
      map((m) => this.generateActionMessage(m, payload.mailbox)),
      map((msg) => this.notifier.notify(msg, 'Undo')),
      switchMap((n) => n.event$),
      filter((e) => e.type === 'action'),
    );
    return merge(
      this.mailConductor.moveMail(payload.mail, payload.mailbox).pipe(
        catchError((err, caught) =>
          currentMailbox$.pipe(
            map((m) => this.generateErrorMessage(m, payload.mailbox)),
            switchMap((msg) => this.notifier.notify(msg, 'Retry').event$),
            filter((e) => e.type === 'action'),
            switchMap(() => caught),
          ),
        ),
        takeUntil(undo$),
      ),
      undo$.pipe(
        switchMap(() =>
          combineLatest([
            this.mailRepo.retrieve(payload.mail.id),
            currentMailbox$,
          ]).pipe(first()),
        ),
        switchMap(([mail, mailbox]) => this.execute({ mail, mailbox })),
      ),
    );
  }

  generateActionMessage(from: Mailbox | null, to: Mailbox | null): string {
    return to
      ? `Mail moved to ${to.name}`
      : from
      ? `Mail removed from ${from.name}`
      : `Mail moved`;
  }

  generateErrorMessage(from: Mailbox | null, to: Mailbox | null): string {
    return to
      ? `Failed to move mail to ${to.name}`
      : from
      ? `Failed to remove mail from ${from.name}`
      : `Failed to move mail`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeleteMailActionFlow implements ActionFlow {
  private mailConductor = inject(MailConductor);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail }): Observable<void> {
    this.notifier.notify('Mail deleted permanently');
    return this.mailConductor.deleteMail(payload.mail).pipe(
      catchError((err, caught) =>
        this.notifier.notify('Failed to delete mail', 'Retry').event$.pipe(
          filter((e) => e.type === 'action'),
          switchMap(() => caught),
        ),
      ),
    );
  }
}
