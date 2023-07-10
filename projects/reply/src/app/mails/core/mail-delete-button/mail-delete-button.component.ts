import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import {
  catchError,
  combineLatest,
  filter,
  first,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { NotificationService } from '@/app/core/notification.service';
import { MailService } from '@/app/data/mail.service';
import { Mailbox } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent {
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);
  private mailService = inject(MailService);
  private notifier = inject(NotificationService);

  @Input() mail!: Mail;

  click = new EventEmitter();

  trashMailbox$ = this.mailboxRepo
    .query((e) => e.name === SystemMailboxName.Trash)
    .pipe(
      map((results) => results[0]),
      filter(Boolean),
      shareReplay(1),
    );

  constructor() {
    this.click
      .pipe(
        switchMap(() => this.trashMailbox$),
        switchMap((trashMailbox) => {
          if (this.mail.mailbox === trashMailbox.id)
            throw new Error('Not implemented');
          return this.moveToMailbox(this.mail, trashMailbox);
        }),
      )
      .subscribe();
  }

  moveToMailbox(mail: Mail, mailbox: Mailbox): Observable<void> {
    // TODO: allow for undoing even when request is not completed
    return this.mailService.moveMail(mail, mailbox).pipe(
      catchError((err, caught) =>
        this.notifier
          .notify(`Failed to move mail to ${mailbox.name}`, 'Retry')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            switchMap(() => caught),
          ),
      ),
      switchMap(() =>
        this.notifier
          .notify(`Mail moved to ${mailbox.name}`, 'Undo')
          .event$.pipe(
            filter((e) => e.type === 'action'),
            switchMap(() =>
              combineLatest([
                this.mailRepo.retrieve(mail.id),
                this.mailboxRepo.retrieve(mail.mailbox),
              ]).pipe(first()),
            ),
            switchMap(([m, mb]) => this.moveToMailbox(m, mb)),
          ),
      ),
    );
  }
}
