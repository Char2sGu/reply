import { inject, Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import {
  catchError,
  combineLatest,
  EMPTY,
  first,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';
import { Mailbox } from '@/app/data/mailbox.model';

import { InvalidResponseException } from '../../core/exceptions';
import { access, asserted, PropertyPath } from '../../core/property-path.utils';
import { Contact } from '../../data/contact.model';
import { ContactRepository } from '../../data/contact.repository';
import { Mail } from '../../data/mail.model';
import { GMAIL_SYSTEM_MAILBOXES } from './gmail-system-mailboxes.token';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageParser {
  private user$ = inject(AuthenticationService).user$;
  private contactRepo = inject(ContactRepository);
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  parseMessage(message: gapi.client.gmail.Message): Observable<Partial<Mail>> {
    const content =
      message.payload &&
      (this.parseBody(message.payload) ?? '<content not supported>');
    const headerData =
      message.payload?.headers && this.parseHeaders(message.payload.headers);

    const sender$ = headerData?.sender
      ? this.getOrCreateContactByAddress(headerData.sender)
      : of(null);
    const recipientsStreams = headerData?.recipients?.map((addr) =>
      this.getOrCreateContactByAddress(addr),
    );

    return combineLatest([sender$, ...(recipientsStreams ?? [])]).pipe(
      map(
        ([sender, ...recipients]): Partial<Mail> => ({
          id: message.id,
          subject: headerData?.subject,
          sender: sender?.id,
          recipients: recipients.length
            ? recipients.map((r) => r.id)
            : undefined,
          sentAt: headerData?.sentAt,
          snippet: message?.snippet,
          content,
          isStarred: message.labelIds?.includes('STARRED'),
          isRead: message.labelIds?.includes('UNREAD'),
          mailbox:
            message.labelIds &&
            this.parseLabelIdsIntoMailboxId(message.labelIds),
        }),
      ),
    );
  }

  parseFullMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    const paths = <P extends PropertyPath<Mail>>(paths: P[]) => paths;
    return this.parseMessage(message).pipe(
      map((m) =>
        asserted(m, [
          ...paths(['id', 'subject', 'sender', 'recipients', 'sentAt']),
          ...paths(['snippet', 'content', 'isStarred', 'isRead', 'mailbox']),
        ]),
      ),
      catchError(() => EMPTY),
    );
  }

  private parseHeaders(headers: gapi.client.gmail.MessagePartHeader[]): {
    subject?: string;
    sender?: EmailAddress;
    recipients?: EmailAddress[];
    sentAt?: Date;
  } {
    const subject = headers.find((h) => h.name === 'Subject')?.value;

    const senderString = headers.find((h) => h.name === 'From')?.value;
    const sender = senderString
      ? this.parseAddressString(senderString)
      : undefined;

    const recipientsString = headers //
      .find((h) => h.name === 'To')?.value;
    const recipients = recipientsString
      ?.split(',')
      .map((s) => s.trim())
      .map((s) => this.parseAddressString(s));

    const sentAtString = headers.find((h) => h.name === 'Date')?.value;
    const sentAt = sentAtString ? new Date(sentAtString) : undefined;

    return { subject, sender, recipients, sentAt };
  }

  private parseBody(root: gapi.client.gmail.MessagePart): string | null {
    if (root.mimeType === 'text/plain') {
      const base64Url = access(root, 'body.data');
      return Base64.decode(base64Url);
    }
    for (const part of root.parts ?? []) {
      const result = this.parseBody(part);
      if (result) return result;
    }
    return null;
  }

  private parseAddressString(value: string): EmailAddress {
    const match = value.match(/^(.+?)\s+<(.+?)>$/u);
    if (!match) return { email: value };
    const [, name, email] = match;
    return { name, email };
  }

  private parseLabelIdsIntoMailboxId(labelIds: string[]): Mailbox['id'] {
    const systemMailboxIds = this.systemMailboxes.map((m) => m.id);
    const mailboxId = labelIds.find(
      (id) => systemMailboxIds.includes(id) || id.startsWith('Label_'),
    );
    if (!mailboxId) throw new InvalidResponseException('Missing mailbox label');
    return mailboxId;
  }

  private getOrCreateContactByAddress(
    address: EmailAddress,
  ): Observable<Contact> {
    return this.user$.pipe(
      first(),
      switchMap(() => this.contactRepo.query((e) => e.email === address.email)),
      first(),
      switchMap((results) =>
        results.length
          ? this.contactRepo.retrieve(results[0].id)
          : this.contactRepo.insert({
              id: address.email,
              name: address.name,
              email: address.email,
            }),
      ),
    );
  }
}

interface EmailAddress {
  name?: string;
  email: string;
}
