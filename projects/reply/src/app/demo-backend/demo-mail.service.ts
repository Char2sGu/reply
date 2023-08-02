import { inject, Injectable } from '@angular/core';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';

import { Mail } from '../data/mail/mail.model';
import { MailRepository } from '../data/mail/mail.repository';
import { MailService, MailServiceException } from '../data/mail/mail.service';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { DEMO_MAILS } from './core/mail/demo-mails.object';

@Injectable()
export class DemoMailService implements MailService {
  private mails = inject(DEMO_MAILS);
  private mailRepo = inject(MailRepository);

  loadMails(): Observable<Mail[]> {
    return combineLatest(this.mails.map((m) => this.mailRepo.record(m)));
  }

  loadMail(id: string): Observable<Mail> {
    const mail = this.mails.find((m) => m.id === id);
    if (!mail) {
      const msg = `Mail ${id} not found`;
      return throwError(() => new MailServiceException(msg));
    }
    return from(this.mailRepo.record(mail));
  }

  markMailAsStarred(mail: Mail): Observable<void> {
    this.mailRepo.patch(mail.id, { isStarred: true });
    return of(undefined);
  }
  markMailAsNotStarred(mail: Mail): Observable<void> {
    this.mailRepo.patch(mail.id, { isStarred: false });
    return of(undefined);
  }

  markMailAsRead(mail: Mail): Observable<void> {
    this.mailRepo.patch(mail.id, { isRead: true });
    return of(undefined);
  }
  markMailAsUnread(mail: Mail): Observable<void> {
    this.mailRepo.patch(mail.id, { isRead: false });
    return of(undefined);
  }

  moveMail(mail: Mail, mailbox: Mailbox): Observable<void> {
    this.mailRepo.patch(mail.id, { mailbox: mailbox.id });
    return of(undefined);
  }

  deleteMail(mail: Mail): Observable<void> {
    this.mailRepo.delete(mail.id);
    return of(undefined);
  }
}
