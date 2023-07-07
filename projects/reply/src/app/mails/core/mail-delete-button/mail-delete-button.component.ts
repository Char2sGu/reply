import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
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
  private mailRepo = inject(MailRepository);
  @Input() mail!: Mail;

  click$ = new EventEmitter();

  ngOnInit(): void {
    this.click$.subscribe(() => {
      if (this.mail.mailboxName === 'Trash') this.mailRepo.delete(this.mail.id);
      else this.mailRepo.patch(this.mail.id, { mailboxName: 'Trash' });
    });
  }
}
