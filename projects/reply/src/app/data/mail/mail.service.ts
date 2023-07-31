import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { BackendSyncApplier } from '../core/backend-sync-applier.service';
import {
  onErrorUndo,
  switchMapToAllRecorded,
  switchMapToRecorded,
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
  private syncApplier = inject(BackendSyncApplier);

  private syncToken$ = new BehaviorSubject<string | null>(null);
  private nextPageToken$ = new BehaviorSubject<string | null>(null);

  loadMails(options?: { continuous?: boolean }): Observable<Mail[]> {
    if (!options?.continuous) this.nextPageToken$.next(null);
    return this.nextPageToken$.pipe(
      switchMap((pageToken) => {
        const isFirstPage = !pageToken;
        const loadMails$ = this.backend.loadMailPage(pageToken ?? undefined);
        return isFirstPage
          ? this.backend.obtainSyncToken().pipe(
              tap((token) => this.syncToken$.next(token)),
              switchMap(() => loadMails$),
            )
          : loadMails$;
      }),
      tap((page) => this.nextPageToken$.next(page.nextPageToken ?? null)),
      map((page) => page.results),
      switchMapToAllRecorded(this.repo),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.backend.loadMail(id).pipe(switchMapToRecorded(this.repo));
  }

  syncMails(): Observable<void> {
    return this.syncToken$.pipe(
      switchMap((syncToken) => {
        if (!syncToken)
          return throwError(() => new Error('Missing sync token'));
        return this.backend.syncMails(syncToken);
      }),
      tap((r) => this.syncToken$.next(r.syncToken)),
      tap((r) => this.syncApplier.applyChanges(this.repo, r.changes)),
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
      switchMapToRecorded(this.repo),
      onErrorUndo(optimisticUpdate),
      map(() => undefined),
    );
  }
}
