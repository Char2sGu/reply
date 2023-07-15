import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  filter,
  first,
  map,
  merge,
  Observable,
  switchMap,
  takeUntil,
} from 'rxjs';

import { ActionFlow, useActionFlow } from '@/app/core/action-flow';
import { NotificationService } from '@/app/core/notification/notification.service';
import { PopupService } from '@/app/core/popup/popup.service';
import { Mail } from '@/app/data/mail.model';
import { MailRepository } from '@/app/data/mail.repository';
import { MailService } from '@/app/data/mail.service';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

import { MailboxSelectionPopupComponent } from './mailbox-selection-popup/mailbox-selection-popup.component';

@Injectable({
  providedIn: 'root',
})
export class ToggleMailStarredStatusActionFlow implements ActionFlow {
  private mailService = inject(MailService);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail }): Observable<void> {
    const action$ = payload.mail.isStarred
      ? this.mailService.markMailAsNotStarred(payload.mail)
      : this.mailService.markMailAsStarred(payload.mail);
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
export class MoveMailActionFlow implements ActionFlow {
  private popupService = inject(PopupService);
  private moveMailToMailbox = useActionFlow(MoveMailToMailboxActionFlow);

  execute(payload: { mail: Mail; currentMailbox?: Mailbox }): Observable<void> {
    const popupRef = this.popupService.popup(
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
  private mailService = inject(MailService);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail; mailbox: Mailbox }): Observable<void> {
    const undo$ = this.notifier
      .notify(`Mail moved to ${payload.mailbox.name}`, 'Undo')
      .event$.pipe(filter((e) => e.type === 'action'));
    return merge(
      this.mailService.moveMail(payload.mail, payload.mailbox).pipe(
        catchError((err, caught) =>
          this.notifier
            .notify(`Failed to move mail to ${payload.mailbox.name}`, 'Retry')
            .event$.pipe(
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
            this.mailboxRepo.retrieve(payload.mail.mailbox),
          ]).pipe(first()),
        ),
        switchMap(([mail, mailbox]) => this.execute({ mail, mailbox })),
      ),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeleteMailActionFlow implements ActionFlow {
  private mailService = inject(MailService);
  private notifier = inject(NotificationService);

  execute(payload: { mail: Mail }): Observable<void> {
    this.notifier.notify('Mail deleted permanently');
    return this.mailService.deleteMail(payload.mail).pipe(
      catchError((err, caught) =>
        this.notifier.notify('Failed to delete mail', 'Retry').event$.pipe(
          filter((e) => e.type === 'action'),
          switchMap(() => caught),
        ),
      ),
    );
  }
}
