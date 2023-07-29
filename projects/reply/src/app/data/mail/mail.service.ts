import { inject, Injectable } from '@angular/core';
import {
  combineLatest,
  last,
  map,
  merge,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import {
  onErrorUndo,
  switchToAllRecorded,
  switchToRecorded,
} from '../core/reactive-repository.utils';
import { Mailbox } from '../mailbox/mailbox.model';
import { MailBackend } from './mail.backend';
import { MailDatabase } from './mail.database';
import { Mail } from './mail.model';
import { MailRepository } from './mail.repository';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private backend = inject(MailBackend);
  private repo = inject(MailRepository);
  private database = inject(MailDatabase);

  syncToken?: string;
  nextPageToken?: string;

  loadMails(options?: { initial?: boolean }): Observable<Mail[]> {
    if (options?.initial) this.nextPageToken = undefined;
    const isFirstPage = !this.nextPageToken;
    return this.backend.loadMails(this.nextPageToken).pipe(
      tap((page) => (this.nextPageToken = page.nextPageToken)),
      switchMap((page) => {
        if (!isFirstPage) return page.results$;
        return page.syncToken$.pipe(
          tap((syncToken) => (this.syncToken = syncToken)),
          switchMap(() => page.results$),
        );
      }),
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
      switchMap(({ changes }) => {
        const streams: Observable<unknown>[] = changes.map((change) => {
          switch (change.type) {
            case 'deletion': {
              return this.database
                .delete(change.id)
                .pipe(tap(() => this.repo.delete(change.id)));
            }
            case 'creation': {
              return this.database
                .persist(change.payload)
                .pipe(tap(() => this.repo.insert(change.payload)));
            }
            case 'update': {
              const update = this.repo.patch(change.id, change.payload);
              return this.database
                .persist(update.curr)
                .pipe(onErrorUndo(update));
            }
            default:
              throw new Error(`Unknown change ${change}`);
          }
        });
        return combineLatest(streams);
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
    return merge(
      this.database.delete(mail.id),
      this.backend.deleteMail(mail),
    ).pipe(onErrorUndo(optimisticUpdate), last());
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
