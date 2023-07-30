import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';

import { access } from '../core/property-path.utils';
import {
  MailBackend,
  MailPage,
  MailSyncChange,
  MailSyncResult,
} from '../data/mail/mail.backend';
import { Mail } from '../data/mail/mail.model';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { GmailMessageResolver } from './core/gmail-message-resolver.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailBackend implements MailBackend {
  private messageResolver = inject(GmailMessageResolver);

  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);
  private messageModifyApi = useGoogleApi((a) => a.gmail.users.messages.modify);
  private messageDeleteApi = useGoogleApi((a) => a.gmail.users.messages.delete);
  private historyListApi = useGoogleApi((a) => a.gmail.users.history.list);

  private latestHistoryId?: string;

  loadMailPage(pageToken?: string): Observable<MailPage> {
    const isFirstPage = !pageToken;
    return this.messageListApi({
      userId: 'me',
      pageToken,
      includeSpamTrash: true,
    }).pipe(
      switchMap((response) => {
        const messages = response.result.messages ?? [];
        const mails$ = combineLatest(
          messages.map((m) => this.loadMail(access(m, 'id'))),
        );
        const latestHistoryIdOfPage$ = this.loadMessageHistoryId(
          access(messages[0], 'id'),
        ).pipe(
          tap((historyId) => {
            this.latestHistoryId = historyId;
          }),
        );
        const latestHistoryId$ =
          isFirstPage || !this.latestHistoryId
            ? latestHistoryIdOfPage$
            : of(this.latestHistoryId);
        return combineLatest([mails$, latestHistoryId$]).pipe(
          map(
            ([mails, latestHistoryId]): MailPage => ({
              results: mails,
              syncToken: latestHistoryId,
              nextPageToken: response.result.nextPageToken,
            }),
          ),
        );
      }),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.messageGetApi({ userId: 'me', id }).pipe(
      map((response) => response.result),
      map((msg) => this.messageResolver.resolveFullMessage(msg)),
    );
  }

  syncMails(syncToken: string): Observable<MailSyncResult> {
    return this.historyListApi({
      userId: 'me',
      startHistoryId: syncToken,
    }).pipe(
      switchMap((response) => {
        const histories = access(response.result, 'history');
        const changes = histories.flatMap((h) => this.resolveHistory(h));
        const syncToken = access(response.result, 'historyId');
        return combineLatest(changes).pipe(
          map((changes) => ({ changes, syncToken })),
        );
      }),
    );
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
      map((response) => response.result),
      map((msg) => this.messageResolver.resolveMessage(msg)),
      map((updates) => Object.assign(mail, updates)),
    );
  }

  private loadMessageHistoryId(id: string): Observable<string> {
    return this.messageGetApi({ userId: 'me', id, fields: 'historyId' }).pipe(
      map((response) => access(response.result, 'historyId')),
    );
  }

  private resolveHistory(
    history: gapi.client.gmail.History,
  ): Observable<MailSyncChange>[] {
    const changes: Observable<MailSyncChange>[] = [];
    [...(history.labelsAdded ?? []), ...(history.labelsRemoved ?? [])].forEach(
      (entry) => {
        const message = access(entry, 'message');
        const mail = this.messageResolver.resolveMessage(message);
        changes.push(
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
      changes.push(
        mail$.pipe(
          map((mail) => ({
            type: 'creation',
            id: mail.id,
            payload: mail,
          })),
        ),
      );
    });
    history.messagesDeleted?.forEach((entry) => {
      const message = access(entry, 'message');
      changes.push(
        of({
          type: 'deletion',
          id: access(message, 'id'),
        }),
      );
    });
    return changes;
  }
}
