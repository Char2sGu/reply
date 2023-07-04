import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';
import { MailListRefreshEvent } from '../mail-list-refresh.event';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent implements OnInit {
  @Input() mail!: Mail;

  click$ = new EventEmitter();

  constructor(
    private mailRepo: MailRepository,
    private listRefresh$: MailListRefreshEvent,
  ) {}

  ngOnInit(): void {
    this.click$.subscribe(() => {
      if (this.mail.mailboxName === 'Trash') this.mailRepo.delete(this.mail.id);
      else this.mailRepo.patch(this.mail.id, { mailboxName: 'Trash' });
      this.listRefresh$.emit();
    });
  }
}
