import { inject, Injectable } from '@angular/core';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';

import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { Mailbox } from '../data/mailbox.model';
import { DEMO_MAILS } from './core/mail/demo-mails.token';

@Injectable()
export class DemoMailService implements MailService {
  private mails = inject(DEMO_MAILS);
  private mailRepo = inject(MailRepository);

  loadMails(): Observable<Mail[]> {
    return combineLatest(this.mails.map((m) => this.mailRepo.insertOrPatch(m)));
  }

  loadMail(id: string): Observable<Mail> {
    const mail = this.mails.find((m) => m.id === id);
    if (!mail) return throwError(() => new Error(`Mail ${id} not found`));
    return from(this.mailRepo.insertOrPatch(mail));
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
}
