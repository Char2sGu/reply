import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Contact } from '@/app/entity/contact/contact.model';
import { Mail } from '@/app/entity/mail/mail.model';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent {
  @Input({ required: true }) user!: Contact;
  @Input({ required: true }) mail!: Mail;
  @Input({ required: true }) sender!: Contact;
  @Input({ required: true }) recipients!: Contact[];
}
