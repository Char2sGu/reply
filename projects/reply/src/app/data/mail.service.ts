import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mail } from './mail.model';
import { Mailbox } from './mailbox.model';

@Injectable()
export abstract class MailService {
  abstract loadMails(): Observable<Mail[]>;
  abstract loadMail(id: Mail['id']): Observable<Mail>;
  abstract markMailAsStarred(id: Mail['id']): Observable<void>;
  abstract markMailAsNotStarred(id: Mail['id']): Observable<void>;
  abstract markMailAsRead(id: Mail['id']): Observable<void>;
  abstract markMailAsUnread(id: Mail['id']): Observable<void>;
  abstract moveMail(id: Mail['id'], mailboxId: Mailbox['id']): Observable<void>;
}
