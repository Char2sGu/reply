import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { Page, SyncResult } from '../data/core/backend.models';
import { MailBackend, MailBackendException } from '../data/mail/mail.backend';
import { Mail } from '../data/mail/mail.model';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { DEMO_MAILS } from './core/mail/demo-mails.object';

const SYNC_TOKEN = '<mail-sync-token>';

@Injectable()
export class DemoMailBackend implements MailBackend {
  private mails = inject(DEMO_MAILS);

  loadMailPage(): Observable<Page<Mail>> {
    return of({ results: this.mails });
  }

  loadMail(id: string): Observable<Mail> {
    return of(null).pipe(
      map(() => {
        const mail = this.mails.find((m) => m.id === id);
        if (!mail) throw new MailBackendException(`Mail ${id} not found`);
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
