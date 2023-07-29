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
        sender: this.recordTemporaryContact(sender.email, sender.name).id,
      }),
      ...(recipients && {
        recipients: recipients.map(
          (r) => this.recordTemporaryContact(r.email, r.name).id,
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

  recordTemporaryContact(email: string, name?: string): Contact {
    const update = this.contactRepo.record({
      id: email,
      name,
      email,
      temporary: true,
    });
    return update.curr;
  }
}
