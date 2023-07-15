import { inject, Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { combineLatest, first, map, Observable, of, switchMap } from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';
import { Mailbox } from '@/app/data/mailbox.model';

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
    const bodyData =
      message.payload && this.parseBodyIntoContentAndType(message.payload);
    const headerData =
      message.payload?.headers && this.parseHeaders(message.payload.headers);
    const sender$ = headerData?.sender
      ? this.getOrCreateContactByAddress(headerData.sender)
      : of(null);
    const recipientStreams = headerData?.recipients?.map((addr) =>
      this.getOrCreateContactByAddress(addr),
    );
    return combineLatest([sender$, ...(recipientStreams ?? [])]).pipe(
      map(
        // eslint-disable-next-line complexity
        ([sender, ...recipients]): Partial<Mail> => ({
          ...(message.id && {
            id: message.id,
          }),
          ...(headerData?.subject && {
            subject: headerData.subject,
          }),
          ...(sender && {
            sender: sender.id,
          }),
          ...(recipientStreams && {
            recipients: recipients.map((r) => r.id),
          }),
          ...(headerData?.sentAt && {
            sentAt: headerData.sentAt,
          }),
          ...(message.snippet && {
            snippet: message.snippet,
          }),
          ...(bodyData && {
            content: bodyData.content,
            contentType: bodyData.contentType,
          }),
          ...(message.labelIds && {
            isStarred: message.labelIds.includes('STARRED'),
            isRead: !message.labelIds.includes('UNREAD'),
            type: this.parseLabelIdsIntoMailType(message.labelIds),
            mailbox:
              this.parseLabelIdsIntoMailboxId(message.labelIds) ?? undefined,
          }),
        }),
      ),
    );
  }

  parseFullMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    const paths = <P extends PropertyPath<Mail>>(...paths: P[]) => paths;
    return this.parseMessage(message).pipe(
      map((m) =>
        asserted(m, [
          ...paths('id', 'sender', 'sentAt', 'content', 'contentType'),
          ...paths('isRead', 'type', 'isStarred'),
        ]),
      ),
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

  private parseBody(
    root: gapi.client.gmail.MessagePart,
    mimeType: string,
  ): string | null {
    if (root.mimeType === mimeType) {
      const base64Url = access(root, 'body.data');
      return Base64.decode(base64Url);
    }
    for (const part of root.parts ?? []) {
      const result = this.parseBody(part, mimeType);
      if (result) return result;
    }
    return null;
  }

  private parseBodyIntoContentAndType(
    root: gapi.client.gmail.MessagePart,
  ): Pick<Mail, 'content' | 'contentType'> {
    const contentInHtml = this.parseBody(root, 'text/html');
    if (contentInHtml) return { content: contentInHtml, contentType: 'html' };
    const contentInPlainText = this.parseBody(root, 'text/plain');
    if (contentInPlainText)
      return { content: contentInPlainText, contentType: 'plain-text' };
    return { content: '<content not supported>', contentType: 'plain-text' };
  }

  private parseAddressString(value: string): EmailAddress {
    const match = value.match(/^(.+?)\s+<(.+?)>$/u);
    if (!match) return { email: value };
    const [, name, email] = match;
    return { name, email };
  }

  private parseLabelIdsIntoMailType(labelIds: string[]): Mail['type'] {
    if (labelIds.includes('SENT')) return 'sent';
    if (labelIds.includes('DRAFT')) return 'draft';
    return 'received';
  }

  private parseLabelIdsIntoMailboxId(labelIds: string[]): Mailbox['id'] | null {
    const systemMailboxIds = this.systemMailboxes.map((m) => m.id);
    const mailboxId = labelIds.find(
      (id) => systemMailboxIds.includes(id) || id.startsWith('Label_'),
    );
    return mailboxId ?? null;
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
