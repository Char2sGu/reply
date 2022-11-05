import { Injectable } from '@angular/core';
import { filter, Observable, of } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mails';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mailsRead = new WeakSet<Mail>();

  constructor() {}

  getMailById(mailId: Mail['id']): Observable<Mail> {
    return of(MAILS.filter((mail) => mail.id === mailId).at(0)).pipe(
      filter((value): value is NonNullable<typeof value> => {
        if (!value) throw new Error('Mail not found');
        return true;
      }),
    );
  }

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
