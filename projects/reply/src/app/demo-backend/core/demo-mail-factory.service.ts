import { Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm';

import { Mail } from '@/app/data/mail.model';

import { DemoEntityFactory } from './demo-entity-factory';

@Injectable({
  providedIn: 'root',
})
export class DemoMailFactory implements DemoEntityFactory {
  private nextId = 1;
  private now = dayjs();

  create(payload: {
    id?: string;
    subject: string;
    sender: string;
    recipients: string[];
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
      sender: payload.sender,
      recipients: payload.recipients,
      snippet: payload.content.split('\n')[0],
      content: payload.content,
      sentAt: payload.sentAt(this.now).toDate(),
      isStarred: payload.isStarred ?? false,
      isRead: payload.isRead ?? false,
      mailbox: payload.mailbox,
    };
  }

  private trimContent(raw: string): string {
    const lines = raw.split('\n').map((line) => line.trim());
    return lines.join('\n').trim();
  }
}
