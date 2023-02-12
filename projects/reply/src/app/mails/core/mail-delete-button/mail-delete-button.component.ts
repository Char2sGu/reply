import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';
import { MailCardListComponent } from '../../mail-card-list/mail-card-list.component';

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
    private mailService: MailRepository,
    private listComponent: MailCardListComponent,
  ) {}

  ngOnInit(): void {
    this.click$.subscribe(() => {
      if (this.mail.mailboxName === 'Trash')
        this.mailService.delete(this.mail.id);
      else this.mailService.update(this.mail.id, { mailboxName: 'Trash' });
      this.listComponent.refresh();
    });
  }
}
