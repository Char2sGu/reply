import { inject, Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

import { Mailbox } from '@/app/data/mailbox.model';

import { access, asserted, PropertyPath } from '../../core/property-path.utils';
import { Contact } from '../../data/contact.model';
import { Mail } from '../../data/mail.model';
import { GMAIL_SYSTEM_MAILBOXES } from './gmail-system-mailboxes.token';

@Injectable({
  providedIn: 'root',
})
export class GmailMessageParser {
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  // eslint-disable-next-line complexity
  parseMessage(
    message: gapi.client.gmail.Message,
    addressResolver: EmailAddressResolver,
  ): Partial<Mail> {
    const bodyData =
      message.payload && this.parseBodyIntoContentAndType(message.payload);
    const headerData =
      message.payload?.headers && this.parseHeaders(message.payload.headers);
    const sender = headerData?.sender
      ? addressResolver(headerData.sender)
      : null;
    const recipients = headerData?.recipients?.map((addr) =>
      addressResolver(addr),
    );
    return {
      ...(message.id && {
        id: message.id,
      }),
      ...(headerData?.subject && {
        subject: headerData.subject,
      }),
      ...(sender && {
        sender: sender.id,
      }),
      ...(recipients && {
        recipients: recipients.map((r) => r.id),
      }),
      ...(message.internalDate && {
        sentAt: new Date(Number(message.internalDate)),
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
        mailbox: this.parseLabelIdsIntoMailboxId(message.labelIds) ?? undefined,
      }),
    };
  }

  parseFullMessage(
    message: gapi.client.gmail.Message,
    addressResolver: EmailAddressResolver,
  ): Mail {
    const paths = <P extends PropertyPath<Mail>>(...paths: P[]) => paths;
    const mail = this.parseMessage(message, addressResolver);
    return asserted(mail, [
      ...paths('id', 'sender', 'sentAt', 'content', 'contentType'),
      ...paths('isRead', 'type', 'isStarred'),
    ]);
  }

  private parseHeaders(headers: gapi.client.gmail.MessagePartHeader[]): {
    subject?: string;
    sender?: EmailAddress;
    recipients?: EmailAddress[];
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

    return { subject, sender, recipients };
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
}

export interface EmailAddressResolver {
  (address: EmailAddress): Contact;
}

export interface EmailAddress {
  name?: string;
  email: string;
}
