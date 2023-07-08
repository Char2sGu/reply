import { inject, Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { Mailbox } from '@/app/data/mailbox.model';

import { InvalidResponseException } from '../../core/exceptions';
import { access, asserted } from '../../core/property-path.utils';
import { Contact } from '../../data/contact.model';
import { ContactRepository } from '../../data/contact.repository';
import { Mail } from '../../data/mail.model';
import { GMAIL_SYSTEM_MAILBOXES } from './gmail-system-mailboxes.token';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageParser {
  private contactRepo = inject(ContactRepository);
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  parseMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    const msg = asserted(message, [
      'id',
      'labelIds',
      'snippet',
      'payload',
      'payload.headers',
    ]);

    const headerData = this.parseHeaders(msg.payload.headers);
    const content = this.parseParts(msg.payload) ?? '<content not supported>';

    return combineLatest([
      this.getOrCreateContactByAddress(headerData.sender),
      ...headerData.recipients.map((addr) =>
        this.getOrCreateContactByAddress(addr),
      ),
    ]).pipe(
      map(
        ([sender, ...recipients]): Mail => ({
          id: msg.id,
          subject: headerData.subject,
          sender: sender.id,
          recipients: recipients.map((r) => r.id),
          sentAt: headerData.sentAt,
          snippet: msg.snippet,
          content,
          isStarred: msg.labelIds.includes('STARRED'),
          isRead: !msg.labelIds.includes('UNREAD'),
          mailbox: this.findMailboxIdFromLabelIds(msg.labelIds),
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
    // TODO: subject can be missing
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

  private parseParts(root: gapi.client.gmail.MessagePart): string | null {
    if (root.mimeType === 'text/plain') {
      const base64Url = access(root, 'body.data');
      return Base64.decode(base64Url);
    }
    for (const part of root.parts ?? []) {
      const result = this.parseParts(part);
      if (result) return result;
    }
    return null;
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

  private findMailboxIdFromLabelIds(labelIds: string[]): Mailbox['id'] {
    const systemMailboxIds = this.systemMailboxes.map((m) => m.id);
    const mailboxId = labelIds.find(
      (id) => systemMailboxIds.includes(id) || id.startsWith('Label_'),
    );
    if (!mailboxId) throw new InvalidResponseException('Missing mailbox label');
    return mailboxId;
  }
}

interface EmailAddress {
  name?: string;
  email: string;
}
