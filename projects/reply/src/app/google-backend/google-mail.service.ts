import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { access } from '../core/property-path.utils';
import { ReactiveRepositoryUpdate } from '../core/reactive-repository';
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
  private messageDeleteApi = useGoogleApi((a) => a.gmail.users.messages.delete);

  loadMails(): Observable<Mail[]> {
    return this.messageListApi({ userId: 'me', includeSpamTrash: true }).pipe(
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

  moveMail(mail: Mail, mailbox: Mailbox): Observable<void> {
    return this.updateMail(
      mail,
      {
        removeLabelIds: [mail.mailbox],
        addLabelIds: [mailbox.id],
      },
      { mailbox: mailbox.id },
    ).pipe(map(() => undefined));
  }

  deleteMail(mail: Mail): Observable<void> {
    return this.initiateOptimisticMutation(
      () => this.mailRepo.delete(mail.id),
      () => this.messageDeleteApi({ userId: 'me', id: mail.id }),
    ).pipe(map(() => undefined));
  }

  private updateMail(
    mail: Mail,
    body: gapi.client.gmail.ModifyMessageRequest,
    optimisticResult: Partial<Mail>,
  ): Observable<Mail> {
    return this.initiateOptimisticMutation(
      () => this.mailRepo.patch(mail.id, optimisticResult),
      () =>
        this.messageModifyApi({ userId: 'me', id: mail.id }, body).pipe(
          switchMap((response) =>
            this.messageParser.parseMessage(response.result),
          ),
          first(),
          switchMap((updated) => this.mailRepo.patch(mail.id, updated)),
        ),
    );
  }

  private initiateOptimisticMutation<T>(
    optimisticRepoUpdateFactory: () => ReactiveRepositoryUpdate<Mail>,
    mutation: () => Observable<T>,
  ): Observable<T> {
    const optimisticRepoUpdate = optimisticRepoUpdateFactory();
    return mutation().pipe(
      catchError((e) => {
        optimisticRepoUpdate.undo();
        throw e;
      }),
    );
  }
}
