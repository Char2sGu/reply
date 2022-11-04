import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mails';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mailsRead = new WeakSet<Mail>();

  constructor() {}

  getMailsByMailbox(mailboxName: string): Observable<Mail[]> {
    return mailboxName === 'Inbox' ? of(MAILS) : of([]);
  }

  markMailAsRead(mail: Mail): void {
    this.mailsRead.add(mail);
  }

  isMailRead(mail: Mail): boolean {
    return this.mailsRead.has(mail);
  }
}
