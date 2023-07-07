import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';

import { Contact } from '@/app/data/contact.model';
import { ContactRepository } from '@/app/data/contact.repository';

import { Mail } from '../../data/mail.model';
import { MailRepository } from '../../data/mail.repository';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent {
  mailRepo = inject(MailRepository);
  contactRepo = inject(ContactRepository);

  @Input({ required: true }) mail!: Mail;
  @Input({ required: true }) user!: Contact;
}
