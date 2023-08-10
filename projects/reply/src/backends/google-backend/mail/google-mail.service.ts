import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { access } from '../../../app/core/property-path.utils';
import {
  Page,
  SyncChange,
  SyncResult,
} from '../../../app/entity/core/backend.models';
import { Mail } from '../../../app/entity/mail/mail.model';
import { MailService } from '../../../app/entity/mail/mail.service';
import { Mailbox } from '../../../app/entity/mailbox/mailbox.model';
import { useGoogleApi } from '../core/google-apis.utils';
import { GmailMessageResolver } from './gmail-message-resolver.service';

@Injectable()
export class GoogleMailService implements MailService {
  private messageResolver = inject(GmailMessageResolver);

  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);
  private messageModifyApi = useGoogleApi((a) => a.gmail.users.messages.modify);
  private messageDeleteApi = useGoogleApi((a) => a.gmail.users.messages.delete);
  private historyListApi = useGoogleApi((a) => a.gmail.users.history.list);

  loadMailPage(pageToken?: string): Observable<Page<Mail>> {
    return this.messageListApi({
      userId: 'me',
      pageToken,
      includeSpamTrash: true,
    }).pipe(
      switchMap((response) => {
        const messages = response.messages ?? [];
        const mails$ = combineLatest(
          messages.map((m) => this.loadMail(access(m, 'id'))),
        );
        return mails$.pipe(
          map(
            (mails): Page<Mail> => ({
              results: mails,
              nextPageToken: response.nextPageToken,
            }),
          ),
        );
      }),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.messageGetApi({ userId: 'me', id }).pipe(
      map((msg) => this.messageResolver.resolveFullMessage(msg)),
    );
  }

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

  syncMails(syncToken: string): Observable<SyncResult<Mail>> {
    return this.loadHistoryPages(syncToken);
  }

  markMailAsStarred(mail: Mail): Observable<Mail> {
    return this.updateMail(mail, { addLabelIds: ['STARRED'] });
  }
  markMailAsNotStarred(mail: Mail): Observable<Mail> {
    return this.updateMail(mail, { removeLabelIds: ['STARRED'] });
  }

  markMailAsRead(mail: Mail): Observable<Mail> {
    return this.updateMail(mail, { removeLabelIds: ['UNREAD'] });
  }
  markMailAsUnread(mail: Mail): Observable<Mail> {
    return this.updateMail(mail, { addLabelIds: ['UNREAD'] });
  }

  moveMail(mail: Mail, mailbox: Mailbox | null): Observable<Mail> {
    return this.updateMail(mail, {
      removeLabelIds: mail.mailbox ? [mail.mailbox] : [],
      addLabelIds: mailbox ? [mailbox.id] : [],
    });
  }

  deleteMail(mail: Mail): Observable<void> {
    return this.messageDeleteApi({ userId: 'me', id: mail.id }).pipe(
      map(() => undefined),
    );
  }

  private updateMail(
    mail: Mail,
    body: gapi.client.gmail.ModifyMessageRequest,
  ): Observable<Mail> {
    return this.messageModifyApi({ userId: 'me', id: mail.id }, body).pipe(
      map((msg) => this.messageResolver.resolveMessage(msg)),
      map((updates) => ({ ...mail, ...updates })),
    );
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
    const syncChangeStreams: Observable<SyncChange<Mail> | null>[] = [];
    [...(history.labelsAdded ?? []), ...(history.labelsRemoved ?? [])].forEach(
      (entry) => {
        const message = access(entry, 'message');
        const mail = this.messageResolver.resolveMessage(message);
        syncChangeStreams.push(
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
      const mail$ = this.loadMail(access(message, 'id'));
      syncChangeStreams.push(
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
      syncChangeStreams.push(
        of({
          type: 'deletion',
          id: access(message, 'id'),
        }),
      );
    });
    return combineLatest(syncChangeStreams).pipe(
      map((syncChanges) =>
        syncChanges.filter((c): c is NonNullable<typeof c> => !!c),
      ),
    );
  }
}
