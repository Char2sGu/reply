import { inject, Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { InvalidResponseException } from '../../core/exceptions';
import { assertPropertyPaths } from '../../core/property-path.util';
import { Contact } from '../../data/contact.model';
import { ContactRepository } from '../../data/contact.repository';
import { Mail } from '../../data/mail.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleMessageParser {
  private contactRepo = inject(ContactRepository);

  parseMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    const msg = assertPropertyPaths(message, [
      'id',
      'labelIds',
      'snippet',
      'payload',
      'payload.headers',
      'payload.parts',
    ]);

    const headers = msg.payload.headers;
    const headerInfo = this.parseHeaders(headers);

    const contentBase64Url = msg.payload.parts //
      .find((p) => p.mimeType === 'text/plain')?.body?.data;
    if (!contentBase64Url)
      throw new InvalidResponseException('Missing part "text/plain"');
    const content = Base64.decode(contentBase64Url);

    return combineLatest([
      this.getOrCreateContactByAddress(headerInfo.sender),
      ...headerInfo.recipients.map((addr) =>
        this.getOrCreateContactByAddress(addr),
      ),
    ]).pipe(
      map(
        ([sender, ...recipients]): Mail => ({
          id: msg.id,
          subject: headerInfo.subject,
          sender: sender.id,
          recipients: recipients.map((r) => r.id),
          sentAt: headerInfo.sentAt,
          snippet: msg.snippet,
          content,
          isStarred: msg.labelIds.includes('STARRED'),
          isRead: !msg.labelIds.includes('UNREAD'),
          mailboxName: 'Inbox', // TODO: implement parsing
        }),
      ),
    );
  }

  private parseHeaders(headers: gapi.client.gmail.MessagePartHeader[]): {
    subject: string;
    sender: EmailAddress;
    recipients: EmailAddress[];
    sentAt: Date;
  } {
    const subject = headers.find((h) => h.name === 'Subject')?.value;
    if (!subject) throw new InvalidResponseException('Missing subject');

    const senderString = headers.find((h) => h.name === 'From')?.value;
    if (!senderString)
      throw new InvalidResponseException('Missing header "From"');
    const sender = this.parseAddressString(senderString);

    const recipientsString = headers //
      .find((h) => h.name === 'To')?.value;
    if (!recipientsString)
      throw new InvalidResponseException('Missing header "To"');
    const recipients = recipientsString
      .split(',')
      .map((s) => s.trim())
      .map((s) => this.parseAddressString(s));

    const sentAtString = headers.find((h) => h.name === 'Date')?.value;
    if (!sentAtString)
      throw new InvalidResponseException('Missing header "Date"');
    const sentAt = new Date(sentAtString);

    return { subject, sender, recipients, sentAt };
  }

  private getOrCreateContactByAddress(
    address: EmailAddress,
  ): Observable<Contact> {
    return this.contactRepo
      .query((e) => e.email === address.email)
      .pipe(
        first(),
        switchMap((results) =>
          results.length
            ? this.contactRepo.retrieve(results[0].id)
            : this.contactRepo.insert({
                id: address.email,
                name: address.name ?? '',
                email: address.email,
              }),
        ),
      );
  }

  private parseAddressString(value: string): EmailAddress {
    const match = value.match(/^(.+?)\s+<(.+?)>$/u);
    if (!match) return { email: value };
    const [, name, email] = match;
    return { name, email };
  }
}

interface EmailAddress {
  name?: string;
  email: string;
}
