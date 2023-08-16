import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { access } from '@/app/core/property-path.utils';
import { SyncChange, SyncResult } from '@/app/entity/core/synchronization';
import { Mail } from '@/app/entity/mail/mail.model';
import { MailService } from '@/app/entity/mail/mail.service';
import { MailSyncService } from '@/app/entity/mail/mail-sync.service';

import { useGoogleApi } from '../core/google-apis.utils';
import { GmailMessageResolver } from './gmail-message-resolver.service';

@Injectable()
export class GoogleMailSyncService implements MailSyncService {
  private messageResolver = inject(GmailMessageResolver);
  private mailService = inject(MailService);

  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);
  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private historyListApi = useGoogleApi((a) => a.gmail.users.history.list);

  obtainSyncToken(): Observable<string> {
    return this.messageListApi({
      userId: 'me',
      maxResults: 1,
      includeSpamTrash: true,
    }).pipe(
      map((response) => response.messages ?? []),
      map((m) => access(m[0], 'id')),
      switchMap((id) =>
        this.messageGetApi({ userId: 'me', id, fields: 'historyId' }),
      ),
      map((response) => access(response, 'historyId')),
    );
  }

  syncChanges(syncToken: string): Observable<SyncResult<Mail>> {
    return this.loadHistoryPages(syncToken);
  }

  private loadHistoryPages(
    startHistoryId: string,
    startPageToken?: string,
  ): Observable<SyncResult<Mail>> {
    return this.historyListApi({
      userId: 'me',
      startHistoryId,
      pageToken: startPageToken,
    }).pipe(
      switchMap((response) => {
        const histories = response.history ?? [];
        const changes = histories.map((h) => this.resolveHistory(h));
        const syncToken = access(response, 'historyId');
        const result$ = changes.length
          ? combineLatest(changes).pipe(
              map((changes) => ({ changes: changes.flat(), syncToken })),
              switchMap((result) => {
                if (!response.nextPageToken) return of(result);
                return this.loadHistoryPages(
                  startHistoryId,
                  response.nextPageToken,
                ).pipe(
                  map((nextPagesResult) => ({
                    changes: [...result.changes, ...nextPagesResult.changes],
                    syncToken: result.syncToken,
                  })),
                );
              }),
            )
          : of({ changes: [], syncToken });
        return result$;
      }),
    );
  }

  private resolveHistory(
    history: gapi.client.gmail.History,
  ): Observable<SyncChange<Mail>[]> {
    const syncChanges: Observable<SyncChange<Mail> | null>[] = [];
    [...(history.labelsAdded ?? []), ...(history.labelsRemoved ?? [])].forEach(
      (entry) => {
        const message = access(entry, 'message');
        const mail = this.messageResolver.resolveMessage(message);
        syncChanges.push(
          of({
            type: 'update',
            id: mail.id,
            payload: mail,
          }),
        );
      },
    );
    history.messagesAdded?.forEach((entry) => {
      const message = access(entry, 'message');
      const mail$ = this.mailService.loadMail(access(message, 'id'));
      syncChanges.push(
        mail$.pipe(
          map(
            (mail): SyncChange<Mail> => ({
              type: 'creation',
              id: mail.id,
              payload: mail,
            }),
          ),
          catchError(() => of(null)), // `messagesAdded` sometimes includes ids that cannot be retrieved
        ),
      );
    });
    history.messagesDeleted?.forEach((entry) => {
      const message = access(entry, 'message');
      syncChanges.push(
        of({
          type: 'deletion',
          id: access(message, 'id'),
        }),
      );
    });
    return syncChanges.length
      ? combineLatest(syncChanges).pipe(
          map((changes) =>
            changes.filter((c): c is NonNullable<typeof c> => !!c),
          ),
        )
      : of([]);
  }
}
