import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mails$ = new BehaviorSubject(MAILS);
  private mailsRead$ = new BehaviorSubject(new WeakSet<Mail>());
  private mailsStarred$ = new BehaviorSubject(new WeakSet<Mail>());

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

  getMailsStarred$(): Observable<Mail[]> {
    return combineLatest([this.mails$, this.mailsStarred$]).pipe(
      map(([mails, mailsStarred]) =>
        mails.filter((mail) => mailsStarred.has(mail)),
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

  markMailAsRead(mail: Mail): void {
    this.mailsRead$.value.add(mail);
    this.mailsRead$.next(this.mailsRead$.value);
  }
  isMailRead(mail: Mail): boolean {
    return this.mailsRead$.value.has(mail);
  }
  isMailRead$(mail: Mail): Observable<boolean> {
    return this.mailsRead$.pipe(map((set) => set.has(mail)));
  }

  markMailAsStarred(mail: Mail): void {
    this.mailsStarred$.value.add(mail);
    this.mailsStarred$.next(this.mailsStarred$.value);
  }
  markMailAsNotStarred(mail: Mail): void {
    this.mailsStarred$.value.delete(mail);
    this.mailsStarred$.next(this.mailsStarred$.value);
  }
  isMailStarred(mail: Mail): boolean {
    return this.mailsStarred$.value.has(mail);
  }
  isMailStarred$(mail: Mail): Observable<boolean> {
    return this.mailsStarred$.pipe(map((set) => set.has(mail)));
  }
}
