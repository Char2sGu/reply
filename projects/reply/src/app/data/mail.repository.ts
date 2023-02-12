import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailRepository {
  private mails$ = new BehaviorSubject(MAILS);

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

  getMails$Starred(): Observable<Mail[]> {
    return this.mails$.pipe(
      map((mails) => mails.filter((mail) => mail.isStarred)),
    );
  }

  getMails$ByKeywords(keywords: string[]): Observable<Mail[]> {
    return this.mails$.pipe(
      map((mails) =>
        mails.filter((mail) =>
          keywords.some((keyword) =>
            mail.subject.toLowerCase().includes(keyword.toLowerCase()),
          ),
        ),
      ),
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
