import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';

@Component({
  selector: 'rpl-mail-delete-button',
  templateUrl: './mail-delete-button.component.html',
  styleUrls: ['./mail-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDeleteButtonComponent implements OnInit {
  @Input() mail!: Mail;

  click$ = new EventEmitter();

  constructor(private mailService: MailRepository) {}

  ngOnInit(): void {
    this.click$.subscribe(() => {
      if (this.mail.mailboxName === 'Trash')
        this.mailService.deleteMail(this.mail.id);
      else this.mailService.updateMail(this.mail.id, { mailboxName: 'Trash' });
    });
  }
}
