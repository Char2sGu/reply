import { Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm';

import { Contact } from '@/app/entity/contact/contact.model';
import { Mail, MailParticipant } from '@/app/entity/mail/mail.model';

import { DemoEntityFactory } from '../core/demo-entity-factory';

@Injectable({
  providedIn: 'root',
})
export class DemoMailFactory implements DemoEntityFactory {
  private nextId = 1;
  private now = dayjs();

  create(payload: {
    id?: string;
    subject: string;
    sender: Contact['email'];
    recipients: Contact['email'][];
    content: string;
    sentAt: (now: Dayjs) => Dayjs;
    isStarred?: boolean;
    isRead?: boolean;
    mailbox: string;
  }): Mail {
    payload.content = this.trimContent(payload.content);
    return {
      id: payload.id ?? String(this.nextId++),
      subject: payload.subject,
      sender: this.participantFromEmail(payload.sender),
      recipients: payload.recipients.map(this.participantFromEmail),
      snippet: payload.content.split('\n')[0],
      content: payload.content,
      contentType: 'plain-text',
      sentAt: payload.sentAt(this.now).toDate(),
      isStarred: payload.isStarred ?? false,
      isRead: payload.isRead ?? false,
      type: 'received',
      mailbox: payload.mailbox,
    };
  }

  private trimContent(raw: string): string {
    const lines = raw.split('\n').map((line) => line.trim());
    return lines.join('\n').trim();
  }

  private participantFromEmail(email: string): MailParticipant {
    return { email };
  }
}
