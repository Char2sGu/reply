import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';

import { asserted } from '@/app/core/property-path.utils';
import { ContactService } from '@/app/data/contact/contact.service';
import { Mail } from '@/app/data/mail/mail.model';

import { GmailMessageParser } from './gmail-message-parser.service';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageResolver {
  private contactService = inject(ContactService);
  private messageParser = inject(GmailMessageParser);

  resolveMessage(
    message: gapi.client.gmail.Message,
  ): Observable<Pick<Mail, 'id'> & Partial<Mail>> {
    const { sender, recipients, ...fields } =
      this.messageParser.parseMessage(message);
    const sender$ =
      sender &&
      this.contactService.resolveEmailAndName(sender.email, sender.name);
    const recipients$ =
      recipients &&
      combineLatest(
        recipients.map((r) =>
          this.contactService.resolveEmailAndName(r.email, r.name),
        ),
      );
    return combineLatest([sender$ ?? of(null), recipients$ ?? of(null)]).pipe(
      map(([sender, recipients]) => ({
        ...fields,
        ...(sender && { sender: sender.id }),
        ...(recipients && { recipients: recipients.map((c) => c.id) }),
      })),
    );
  }

  resolveFullMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    return this.resolveMessage(message).pipe(
      map((result) =>
        asserted(result, [
          'sender',
          'sentAt',
          'content',
          'contentType',
          'isStarred',
          'isRead',
          'type',
        ]),
      ),
    );
  }
}
