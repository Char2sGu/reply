import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

@Component({
  selector: 'rpl-mail-action-menu-button',
  templateUrl: './mail-action-menu-button.component.html',
  styleUrls: ['./mail-action-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionMenuButtonComponent {
  @Input({ required: true }) mail!: Mail;
  @Input() currentMailbox?: Mailbox;
}
