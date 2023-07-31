import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Page, SyncResult } from '../core/backend.models';
import { Mailbox } from '../mailbox/mailbox.model';
import { Mail } from './mail.model';

@Injectable()
export abstract class MailBackend {
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
