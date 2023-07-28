import { inject, Injectable } from '@angular/core';
import {
  combineLatest,
  first,
  map,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { AuthenticationService } from '../core/authentication.service';
import { access } from '../core/property-path.utils';
import { onErrorUndo } from '../data/core/reactive-repository.utils';
import { MailDatabase } from '../data/mail/mail.database';
import { Mail } from '../data/mail/mail.model';
import { MailRepository } from '../data/mail/mail.repository';
import { MailPage, MailService } from '../data/mail/mail.service';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { GmailMessageParser } from './core/gmail-message-parser.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailService implements MailService {
  private user$ = inject(AuthenticationService).user$;
  private messageParser = inject(GmailMessageParser);
  private mailRepo = inject(MailRepository);
  private mailDb = inject(MailDatabase);

  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);
  private messageModifyApi = useGoogleApi((a) => a.gmail.users.messages.modify);
  private messageDeleteApi = useGoogleApi((a) => a.gmail.users.messages.delete);
  private historyListApi = useGoogleApi((a) => a.gmail.users.history.list);

  loadMails(page?: string): Observable<MailPage> {
    return this.messageListApi({
      userId: 'me',
      pageToken: page,
      includeSpamTrash: true,
    }).pipe(
      map(
        (response): MailPage => ({
          results$: combineLatest(
            access(response.result, 'messages').map((m) =>
              this.loadMail(access(m, 'id')),
            ),
          ),
          next: response.result.nextPageToken,
        }),
      ),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.messageGetApi({ userId: 'me', id }).pipe(
      map((response) => response.result),
      withLatestFrom(this.user$.pipe(first())),
      map(([msg, user]) => this.messageParser.parseFullMessage(msg, user)),
      switchMap((mail) => this.mailDb.persist(mail)),
      switchMap((mail) => this.mailRepo.insertOrPatch(mail)),
    );
  }

  syncMails(syncToken: string): Observable<void> {
    return this.historyListApi({
      userId: 'me',
      startHistoryId: syncToken,
    }).pipe(
      withLatestFrom(this.user$.pipe(first())),
      switchMap(([response, user]) => {
        const actions: Observable<unknown>[] = [];
        response.result.history?.forEach((history) => {
          [
            ...(history.labelsAdded ?? []),
            ...(history.labelsRemoved ?? []),
          ].forEach((entry) => {
            const message = access(entry, 'message');
            const mail = this.messageParser.parseMessage(message, user);
            const update = this.mailRepo.patch(access(mail, 'id'), mail);
            const action = this.mailDb
              .persist(update.curr)
              .pipe(onErrorUndo(update));
            actions.push(action);
          });
          history.messagesAdded?.forEach((entry) => {
            const message = access(entry, 'message');
            const action = this.loadMail(access(message, 'id'));
            actions.push(action);
          });
          history.messagesDeleted?.forEach((entry) => {
            const message = access(entry, 'message');
            const update = this.mailRepo.delete(access(message, 'id'));
            const action = this.mailDb
              .delete(update.id)
              .pipe(onErrorUndo(update));
            actions.push(action);
          });
        });
        return combineLatest(actions);
      }),
      map(() => undefined),
    );
  }

  obtainSyncToken(): Observable<string> {
    return this.messageListApi({
      userId: 'me',
      maxResults: 1,
    }).pipe(
      map((response) => access(response.result, 'messages')),
      map((msgs) => access(msgs[0], 'id')),
      switchMap((msgId) => this.messageGetApi({ userId: 'me', id: msgId })),
      map((response) => access(response.result, 'historyId')),
    );
  }

  markMailAsStarred(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { addLabelIds: ['STARRED'] },
      { isStarred: true },
    ).pipe(map(() => undefined));
  }
  markMailAsNotStarred(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { removeLabelIds: ['STARRED'] },
      { isStarred: false },
    ).pipe(map(() => undefined));
  }

  markMailAsRead(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { removeLabelIds: ['UNREAD'] },
      { isRead: true },
    ).pipe(map(() => undefined));
  }
  markMailAsUnread(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { addLabelIds: ['UNREAD'] },
      { isRead: false },
    ).pipe(map(() => undefined));
  }

  moveMail(mail: Mail, mailbox: Mailbox | null): Observable<void> {
    return this.updateMail(
      mail,
      {
        removeLabelIds: mail.mailbox ? [mail.mailbox] : [],
        addLabelIds: mailbox ? [mailbox.id] : [],
      },
      { mailbox: mailbox ? mailbox.id : undefined },
    ).pipe(map(() => undefined));
  }

  deleteMail(mail: Mail): Observable<void> {
    const update = this.mailRepo.delete(mail.id);
    return this.messageDeleteApi({ userId: 'me', id: mail.id }).pipe(
      map(() => undefined),
      onErrorUndo(update),
    );
  }

  private updateMail(
    mail: Mail,
    body: gapi.client.gmail.ModifyMessageRequest,
    optimisticResult: Partial<Mail>,
  ): Observable<Mail> {
    const optimisticUpdate = this.mailRepo.patch(mail.id, optimisticResult);
    return this.messageModifyApi({ userId: 'me', id: mail.id }, body).pipe(
      map((response) => response.result),
      withLatestFrom(this.user$.pipe(first())),
      map(([msg, user]) => this.messageParser.parseMessage(msg, user)),
      onErrorUndo(optimisticUpdate),
      map((updatedFields) => this.mailRepo.patch(mail.id, updatedFields)),
      switchMap((actualUpdate) =>
        this.mailDb.persist(actualUpdate.curr).pipe(onErrorUndo(actualUpdate)),
      ),
    );
  }
}
