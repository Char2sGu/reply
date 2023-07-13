import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mail } from './mail.model';
import { Mailbox } from './mailbox.model';

@Injectable()
export abstract class MailService {
  abstract loadMails(): Observable<Mail[]>;
  abstract loadMail(id: Mail['id']): Observable<Mail>;
  abstract markMailAsStarred(mail: Mail): Observable<void>;
  abstract markMailAsNotStarred(mail: Mail): Observable<void>;
  abstract markMailAsRead(mail: Mail): Observable<void>;
  abstract markMailAsUnread(mail: Mail): Observable<void>;
  abstract moveMail(mail: Mail, mailbox: Mailbox): Observable<void>;
  abstract deleteMail(mail: Mail): Observable<void>;
}
