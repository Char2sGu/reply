import { inject, Injectable } from '@angular/core';

import { asserted } from '@/app/core/property-path.utils';
import { Contact } from '@/app/data/contact/contact.model';
import { ContactRepository } from '@/app/data/contact/contact.repository';
import { Mail } from '@/app/data/mail/mail.model';

import { GmailMessageParser } from './gmail-message-parser.service';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageResolver {
  private contactRepo = inject(ContactRepository);
  private messageParser = inject(GmailMessageParser);

  resolveMessage(
    message: gapi.client.gmail.Message,
  ): Pick<Mail, 'id'> & Partial<Mail> {
    const { sender, recipients, ...fields } =
      this.messageParser.parseMessage(message);
    return {
      ...fields,
      ...(sender && {
        sender: this.resolveEmailAndName(sender.email, sender.name).id,
      }),
      ...(recipients && {
        recipients: recipients.map(
          (r) => this.resolveEmailAndName(r.email, r.name).id,
        ),
      }),
    };
  }

  resolveFullMessage(message: gapi.client.gmail.Message): Mail {
    const result = this.resolveMessage(message);
    return asserted(result, [
      'sender',
      'sentAt',
      'content',
      'contentType',
      'isStarred',
      'isRead',
      'type',
    ]);
  }

  resolveEmailAndName(email: string, name?: string): Contact {
    const result =
      this.contactRepo.queryOne((e) => e.email === email).snapshot ??
      this.contactRepo.insert({ id: email, name, email, type: 'temporary' })
        .curr;
    return result;
  }
}
