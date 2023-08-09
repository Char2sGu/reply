import { inject, Injectable } from '@angular/core';
import parseMessage from 'gmail-api-parse-message';

import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { Mail } from '../../entity/mail/mail.model';
import { GMAIL_SYSTEM_MAILBOXES } from '../core/gmail-system-mailboxes.object';

export type GmailMessageParseResult = Pick<Mail, 'id'> &
  Partial<Omit<Mail, 'id' | 'sender' | 'recipients'>> & {
    sender?: EmailAddress;
    recipients?: EmailAddress[];
  };

@Injectable({
  providedIn: 'root',
})
export class GmailMessageParser {
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  // eslint-disable-next-line complexity
  parseMessage(message: gapi.client.gmail.Message): GmailMessageParseResult {
    const parsed = parseMessage(message);
    return {
      id: parsed.id,
      ...(parsed.headers?.subject && {
        subject: parsed.headers?.subject,
      }),
      ...(parsed.headers?.from && {
        sender: this.parseEmailAddressString(parsed.headers.from),
      }),
      ...(parsed.headers?.to && {
        recipients: parsed.headers.to
          .split(',')
          .map((s) => s.trim())
          .map((s) => this.parseEmailAddressString(s)),
      }),
      ...(parsed.internalDate && {
        sentAt: new Date(Number(parsed.internalDate)),
      }),
      ...(parsed.snippet && {
        snippet: parsed.snippet,
      }),
      ...(parsed.textPlain && {
        content: parsed.textPlain,
        contentType: 'plain-text',
      }),
      ...(parsed.textHtml && {
        content: parsed.textHtml,
        contentType: 'html',
      }),
      ...(parsed.labelIds && {
        isStarred: parsed.labelIds.includes('STARRED'),
        isRead: !parsed.labelIds.includes('UNREAD'),
        type: this.parseLabelIdsIntoMailType(parsed.labelIds),
        mailbox: this.parseLabelIdsIntoMailboxId(parsed.labelIds) ?? undefined,
      }),
    };
  }

  private parseEmailAddressString(value: string): EmailAddress {
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

interface EmailAddress {
  name?: string;
  email: string;
}
