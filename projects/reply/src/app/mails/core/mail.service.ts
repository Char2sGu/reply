import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mails.mock';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mails$ = new BehaviorSubject(MAILS);
  private mailsRead = new WeakSet<Mail>();

  constructor() {}

  getMail$ById(mailId: Mail['id']): Observable<Mail> {
    return this.mails$.pipe(
      map((mails) => mails.find((mail) => mail.id === mailId)),
      filter((value): value is NonNullable<typeof value> => !!value),
    );
  }

  getMails$ByMailbox(mailboxName: string): Observable<Mail[]> {
    return this.mails$.pipe(
      map((mails) => mails.filter((mail) => mail.mailboxName === mailboxName)),
    );
  }

  updateMail(mailId: Mail['id'], mailData: Partial<Mail>): void {
    this.mails$.next(
      this.mails$.value.map((mail) =>
        mail.id === mailId ? { ...mail, ...mailData } : mail,
      ),
    );
  }

  markMailAsRead(mail: Mail): void {
    this.mailsRead.add(mail);
  }

  isMailRead(mail: Mail): boolean {
    return this.mailsRead.has(mail);
  }
}
