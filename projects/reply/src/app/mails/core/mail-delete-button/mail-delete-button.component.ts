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
  merge,
  Observable,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { useSystemMailboxNameMapping } from '@/app/core/mailbox-name.utils';
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

  private systemMailboxes$ = useSystemMailboxNameMapping();
  private trashMailbox$ = this.systemMailboxes$.pipe(
    map((mapping) => mapping[SystemMailboxName.Trash]),
  );

  @Input() mail!: Mail;

  click = new EventEmitter();

  action$ = this.trashMailbox$.pipe(
    map((trashMailbox) => this.mail.mailbox === trashMailbox.id),
    map((inTrash) => (inTrash ? 'delete' : 'move-to-trash')),
  );

  constructor() {
    this.click
      .pipe(
        switchMap(() => this.action$),
        switchMap((action) => {
          if (action === 'delete') return this.deleteMail(this.mail);
          return this.trashMailbox$.pipe(
            first(),
            switchMap((m) => this.moveMail(this.mail, m)),
          );
        }),
      )
      .subscribe();
  }

  deleteMail(mail: Mail): Observable<void> {
    this.notifier.notify('Mail deleted permanently');
    return this.mailService.deleteMail(mail).pipe(
      catchError((err, caught) =>
        this.notifier.notify('Failed to delete mail', 'Retry').event$.pipe(
          filter((e) => e.type === 'action'),
          switchMap(() => caught),
        ),
      ),
    );
  }

  moveMail(mail: Mail, mailbox: Mailbox): Observable<void> {
    const undo$ = this.notifier
      .notify(`Mail moved to ${mailbox.name}`, 'Undo')
      .event$.pipe(filter((e) => e.type === 'action'));
    return merge(
      this.mailService.moveMail(mail, mailbox).pipe(
        catchError((err, caught) =>
          this.notifier
            .notify(`Failed to move mail to ${mailbox.name}`, 'Retry')
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
            this.mailRepo.retrieve(mail.id),
            this.mailboxRepo.retrieve(mail.mailbox),
          ]).pipe(first()),
        ),
        switchMap(([m, mb]) => this.moveMail(m, mb)),
      ),
    );
  }
}
