import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { filter, map, shareReplay, switchMap } from 'rxjs';

import { BuiltInMailboxName } from '@/app/data/mailbox.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent implements OnInit {
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);
  @Input() mail!: Mail;

  click$ = new EventEmitter();

  trashMailbox$ = this.mailboxRepo
    .query((e) => e.name === BuiltInMailboxName.Trash)
    .pipe(
      map((results) => results[0]),
      filter(Boolean),
      shareReplay(1),
    );

  ngOnInit(): void {
    this.click$
      .pipe(switchMap(() => this.trashMailbox$))
      .subscribe((trashMailbox) => {
        if (this.mail.mailbox === trashMailbox.id)
          this.mailRepo.delete(this.mail.id);
        else this.mailRepo.patch(this.mail.id, { mailbox: trashMailbox.id });
      });
  }
}
