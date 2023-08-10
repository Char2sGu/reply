import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { Page, SyncResult } from '@/app/entity/core/backend.models';
import { Mail } from '@/app/entity/mail/mail.model';
import {
  MailService,
  MailServiceException,
} from '@/app/entity/mail/mail.service';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { DEMO_MAILS } from './demo-mails.object';

const SYNC_TOKEN = '<mail-sync-token>';

@Injectable()
export class DemoMailService implements MailService {
  private mails = inject(DEMO_MAILS);

  loadMailPage(): Observable<Page<Mail>> {
    return of({ results: this.mails });
  }

  loadMail(id: string): Observable<Mail> {
    return of(null).pipe(
      map(() => {
        const mail = this.mails.find((m) => m.id === id);
        if (!mail) throw new MailServiceException(`Mail ${id} not found`);
        return mail;
      }),
    );
  }

  obtainSyncToken(): Observable<string> {
    return of(SYNC_TOKEN);
  }

  syncMails(): Observable<SyncResult<Mail>> {
    return of({ changes: [], syncToken: SYNC_TOKEN });
  }

  markMailAsStarred(mail: Mail): Observable<Mail> {
    return of({ ...mail, isStarred: true });
  }

  markMailAsNotStarred(mail: Mail): Observable<Mail> {
    return of({ ...mail, isStarred: false });
  }

  markMailAsRead(mail: Mail): Observable<Mail> {
    return of({ ...mail, isRead: true });
  }

  markMailAsUnread(mail: Mail): Observable<Mail> {
    return of({ ...mail, isRead: false });
  }

  moveMail(mail: Mail, mailbox: Mailbox | null): Observable<Mail> {
    return of({ ...mail, mailbox: mailbox?.id });
  }

  deleteMail(): Observable<void> {
    return of(undefined);
  }
}
