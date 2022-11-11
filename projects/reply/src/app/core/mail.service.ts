import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private mails$ = new BehaviorSubject(MAILS);

  private mailsRead = new WeakSet<Mail>();
  private mailsReadChangeUpdate$ = new EventEmitter();
  private mailsStarred = new WeakSet<Mail>();
  private mailsStarredUpdate$ = new EventEmitter();

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
    return combineLatest([this.mails$, this.mailsStarredUpdate$]).pipe(
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
    this.mailsRead.add(mail);
    this.mailsReadChangeUpdate$.emit();
  }
  markMailAsNotRead(mail: Mail): void {
    this.mailsRead.delete(mail);
    this.mailsReadChangeUpdate$.emit();
  }
  isMailRead(mail: Mail): boolean {
    return this.mailsRead.has(mail);
  }
  isMailRead$(mail: Mail): Observable<boolean> {
    return this.mailsReadChangeUpdate$.pipe(map((set) => set.has(mail)));
  }

  markMailAsStarred(mail: Mail): void {
    this.mailsStarred.add(mail);
    this.mailsStarredUpdate$.emit();
  }
  markMailAsNotStarred(mail: Mail): void {
    this.mailsStarred.delete(mail);
    this.mailsStarredUpdate$.emit();
  }
  isMailStarred(mail: Mail): boolean {
    return this.mailsStarred.has(mail);
  }
  isMailStarred$(mail: Mail): Observable<boolean> {
    return this.mailsStarredUpdate$.pipe(map((set) => set.has(mail)));
  }
}
