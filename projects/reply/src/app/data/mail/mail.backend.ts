import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mailbox } from '../mailbox/mailbox.model';
import { Mail } from './mail.model';

@Injectable()
export abstract class MailBackend {
  abstract loadMails(pageToken?: string): Observable<MailPage>;
  abstract loadMail(id: Mail['id']): Observable<Mail>;
  abstract syncMails(syncToken: string): Observable<MailSyncResult>;
  abstract markMailAsStarred(mail: Mail): Observable<Mail>;
  abstract markMailAsNotStarred(mail: Mail): Observable<Mail>;
  abstract markMailAsRead(mail: Mail): Observable<Mail>;
  abstract markMailAsUnread(mail: Mail): Observable<Mail>;
  abstract moveMail(mail: Mail, mailbox: Mailbox | null): Observable<Mail>;
  abstract deleteMail(mail: Mail): Observable<void>;
}

export interface MailPage {
  results$: Observable<Mail[]>;
  syncToken$: Observable<string>;
  nextPageToken?: string;
}

export interface MailSyncResult {
  changes: MailSyncChange[];
  syncToken: string;
}

export type MailSyncChange =
  | MailSyncDeletion
  | MailSyncCreation
  | MailSyncUpdate;

export interface MailSyncDeletion {
  type: 'deletion';
  id: string;
}
export interface MailSyncCreation {
  type: 'creation';
  id: string;
  payload: Mail;
}
export interface MailSyncUpdate {
  type: 'update';
  id: string;
  payload: Partial<Mail>;
}
