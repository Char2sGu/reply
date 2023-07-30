import { inject, Injectable } from '@angular/core';
import { map, Observable, tap, throwError } from 'rxjs';

import {
  onErrorUndo,
  switchToAllRecorded,
  switchToRecorded,
} from '../core/reactive-repository.utils';
import { Mailbox } from '../mailbox/mailbox.model';
import { MailBackend } from './mail.backend';
import { Mail } from './mail.model';
import { MailRepository } from './mail.repository';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private backend = inject(MailBackend);
  private repo = inject(MailRepository);

  private syncToken?: string;
  private nextPageToken?: string;

  loadMails(options?: { continuous?: boolean }): Observable<Mail[]> {
    if (!options?.continuous) this.nextPageToken = undefined;
    return this.backend.loadMailPage(this.nextPageToken).pipe(
      tap((page) => {
        this.syncToken = page.syncToken;
        this.nextPageToken = page.nextPageToken;
      }),
      map((page) => page.results),
      switchToAllRecorded(this.repo),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.backend.loadMail(id).pipe(switchToRecorded(this.repo));
  }

  syncMails(): Observable<void> {
    if (!this.syncToken)
      return throwError(() => new Error('Missing sync token'));
    return this.backend.syncMails(this.syncToken).pipe(
      tap(({ syncToken }) => (this.syncToken = syncToken)),
      tap(({ changes }) => {
        changes.forEach((change) => {
          switch (change.type) {
            case 'deletion': {
              this.repo.delete(change.id);
              break;
            }
            case 'creation': {
              this.repo.insert(change.payload);
              break;
            }
            case 'update': {
              this.repo.patch(change.id, change.payload);
              break;
            }
            default:
              throw new Error(`Unknown change ${change}`);
          }
        });
      }),
      map(() => undefined),
    );
  }

  markMailAsStarred(mail: Mail): Observable<void> {
    return this.initiateMailUpdateAction(
      mail,
      () => this.backend.markMailAsStarred(mail),
      { isStarred: true },
    );
  }

  markMailAsNotStarred(mail: Mail): Observable<void> {
    return this.initiateMailUpdateAction(
      mail,
      () => this.backend.markMailAsNotStarred(mail),
      { isStarred: false },
    );
  }

  markMailAsRead(mail: Mail): Observable<void> {
    return this.initiateMailUpdateAction(
      mail,
      () => this.backend.markMailAsRead(mail),
      { isRead: true },
    );
  }

  markMailAsUnread(mail: Mail): Observable<void> {
    return this.initiateMailUpdateAction(
      mail,
      () => this.backend.markMailAsUnread(mail),
      { isRead: false },
    );
  }

  moveMail(mail: Mail, mailbox: Mailbox | null): Observable<void> {
    return this.initiateMailUpdateAction(
      mail,
      () => this.backend.moveMail(mail, mailbox),
      { mailbox: mailbox ? mailbox.id : undefined },
    );
  }

  deleteMail(mail: Mail): Observable<void> {
    const optimisticUpdate = this.repo.delete(mail.id);
    return this.backend.deleteMail(mail).pipe(onErrorUndo(optimisticUpdate));
  }

  private initiateMailUpdateAction(
    mail: Mail,
    action: () => Observable<Mail>,
    optimisticResult: Partial<Mail>,
  ): Observable<void> {
    const optimisticUpdate = this.repo.patch(mail.id, optimisticResult);
    return action().pipe(
      switchToRecorded(this.repo),
      onErrorUndo(optimisticUpdate),
      map(() => undefined),
    );
  }
}
