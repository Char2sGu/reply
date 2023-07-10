import { inject, Injectable } from '@angular/core';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { MailboxRepository } from '../data/mailbox.repository';
import { GmailMessageParser } from './core/gmail-message-parser.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailService implements MailService {
  private messageParser = inject(GmailMessageParser);
  private mailRepo = inject(MailRepository);
  private mailboxRepo = inject(MailboxRepository);

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

  markMailAsStarred(id: Mail['id']): Observable<void> {
    return this.modifyMessage(id, { addLabelIds: ['STARRED'] });
  }
  markMailAsNotStarred(id: Mail['id']): Observable<void> {
    return this.modifyMessage(id, { removeLabelIds: ['STARRED'] });
  }

  markMailAsRead(id: string): Observable<void> {
    return this.modifyMessage(id, { removeLabelIds: ['UNREAD'] });
  }
  markMailAsUnread(id: string): Observable<void> {
    return this.modifyMessage(id, { addLabelIds: ['UNREAD'] });
  }

  moveMail(id: string, mailboxId: string): Observable<void> {
    return this.mailboxRepo
      .retrieve(mailboxId)
      .pipe(
        switchMap((mailbox) =>
          this.modifyMessage(id, { addLabelIds: [mailbox.id] }),
        ),
      );
  }

  private modifyMessage(
    id: Mail['id'],
    body: gapi.client.gmail.ModifyMessageRequest,
  ): Observable<void> {
    return this.messageModifyApi({ userId: 'me', id }, body).pipe(
      switchMap((response) => this.messageParser.parseMessage(response.result)),
      switchMap((mail) => this.mailRepo.patch(id, mail)),
      first(),
      map(() => undefined),
    );
  }
}
