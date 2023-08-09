import { inject, Injectable } from '@angular/core';

import { asserted } from '@/app/core/property-path.utils';
import { Mail } from '@/app/data/mail/mail.model';

import { GmailMessageParser } from './gmail-message-parser.service';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageResolver {
  private messageParser = inject(GmailMessageParser);

  resolveMessage(
    message: gapi.client.gmail.Message,
  ): Pick<Mail, 'id'> & Partial<Mail> {
    const { sender, recipients, ...fields } =
      this.messageParser.parseMessage(message);
    return {
      ...fields,
      ...(sender && { sender }),
      ...(recipients && { recipients }),
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
}
