import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  first,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { Mailbox } from '../data/mailbox.model';
import { GmailMessageParser } from './core/gmail-message-parser.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailService implements MailService {
  private messageParser = inject(GmailMessageParser);
  private mailRepo = inject(MailRepository);

  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);
  private messageModifyApi = useGoogleApi((a) => a.gmail.users.messages.modify);

  loadMails(): Observable<Mail[]> {
    return this.messageListApi({ userId: 'me' }).pipe(
      map((r) => access(r, 'result.messages')),
      switchMap((messages) =>
        combineLatest(messages.map((m) => this.loadMail(access(m, 'id')))),
      ),
    );
  }

  loadMail(id: Mail['id']): Observable<Mail> {
    return this.messageGetApi({ userId: 'me', id }).pipe(
      map((response) => response.result),
      switchMap((message) => this.messageParser.parseFullMessage(message)),
      switchMap((mail) => this.mailRepo.insertOrPatch(mail)),
    );
  }

  markMailAsStarred(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { addLabelIds: ['STARRED'] },
      { isStarred: true },
    );
  }
  markMailAsNotStarred(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { removeLabelIds: ['STARRED'] },
      { isStarred: false },
    );
  }

  markMailAsRead(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { removeLabelIds: ['UNREAD'] },
      { isRead: true },
    );
  }
  markMailAsUnread(mail: Mail): Observable<void> {
    return this.updateMail(
      mail,
      { addLabelIds: ['UNREAD'] },
      { isRead: false },
    );
  }

  moveMail(mail: Mail, mailbox: Mailbox): Observable<void> {
    return this.updateMail(
      mail,
      {
        removeLabelIds: [mail.mailbox],
        addLabelIds: [mailbox.id],
      },
      { mailbox: mailbox.id },
    );
  }

  private updateMail(
    mail: Mail,
    body: gapi.client.gmail.ModifyMessageRequest,
    optimisticResult?: Partial<Mail>,
  ): Observable<void> {
    const optimisticRepoUpdate =
      optimisticResult && this.mailRepo.patch(mail.id, optimisticResult);
    return this.messageModifyApi({ userId: 'me', id: mail.id }, body).pipe(
      switchMap((response) => this.messageParser.parseMessage(response.result)),
      first(),
      catchError((e) => {
        optimisticRepoUpdate?.undo();
        throw e;
      }),
      tap((updated) => this.mailRepo.patch(mail.id, updated)),
      map(() => undefined),
    );
  }
}
