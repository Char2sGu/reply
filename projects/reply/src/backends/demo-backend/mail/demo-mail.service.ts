import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { Page } from '@/app/entity/core/page.model';
import { SyncResult } from '@/app/entity/core/synchronization';
import { Mail } from '@/app/entity/mail/mail.model';
import {
  MailService,
  MailServiceException,
} from '@/app/entity/mail/mail.service';
import { MailSyncService } from '@/app/entity/mail/mail-sync.service';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { DEMO_MAILS } from './demo-mails.object';

const SYNC_TOKEN = '<mail-sync-token>';

@Injectable()
export class DemoMailService implements MailService, MailSyncService {
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

  syncChanges(): Observable<SyncResult<Mail>> {
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
