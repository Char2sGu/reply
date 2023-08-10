import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Exception } from '@/app/core/exceptions';

import { Page } from '../core/page.model';
import { SyncResult } from '../core/sync.models';
import { Mailbox } from '../mailbox/mailbox.model';
import { Mail } from './mail.model';

@Injectable()
export abstract class MailService {
  abstract loadMailPage(pageToken?: string): Observable<Page<Mail>>;
  abstract loadMail(id: Mail['id']): Observable<Mail>;
  abstract obtainSyncToken(): Observable<string>;
  abstract syncMails(syncToken: string): Observable<SyncResult<Mail>>;
  abstract markMailAsStarred(mail: Mail): Observable<Mail>;
  abstract markMailAsNotStarred(mail: Mail): Observable<Mail>;
  abstract markMailAsRead(mail: Mail): Observable<Mail>;
  abstract markMailAsUnread(mail: Mail): Observable<Mail>;
  abstract moveMail(mail: Mail, mailbox: Mailbox | null): Observable<Mail>;
  abstract deleteMail(mail: Mail): Observable<void>;
}

export class MailServiceException extends Exception {}
