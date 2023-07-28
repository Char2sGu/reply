import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mailbox } from '../mailbox/mailbox.model';
import { Mail } from './mail.model';

@Injectable()
export abstract class MailService {
  abstract loadMails(page?: string): Observable<MailPage>;
  abstract loadMail(id: Mail['id']): Observable<Mail>;
  abstract syncMails(syncToken: string): Observable<void>;
  abstract obtainSyncToken(): Observable<string>;
  abstract markMailAsStarred(mail: Mail): Observable<void>;
  abstract markMailAsNotStarred(mail: Mail): Observable<void>;
  abstract markMailAsRead(mail: Mail): Observable<void>;
  abstract markMailAsUnread(mail: Mail): Observable<void>;
  abstract moveMail(mail: Mail, mailbox: Mailbox | null): Observable<void>;
  abstract deleteMail(mail: Mail): Observable<void>;
}

export interface MailPage {
  results$: Observable<Mail[]>;
  next?: string;
}
