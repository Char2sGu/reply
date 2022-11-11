import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mails$ = new BehaviorSubject(MAILS);

  constructor() {}

  getMails$(): Observable<Mail[]> {
    return this.mails$;
  }

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

  updateMail(mailId: Mail['id'], mailData: Omit<Partial<Mail>, 'id'>): void {
    this.mails$.next(
      this.mails$.value.map((mail) => {
        if (mail.id === mailId) Object.assign(mail, mailData);
        return mail;
      }),
    );
  }

  deleteMail(mailId: Mail['id']): void {
    this.mails$.next(this.mails$.value.filter((mail) => mail.id !== mailId));
  }
}
