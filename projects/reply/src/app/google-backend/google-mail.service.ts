import { inject, Injectable } from '@angular/core';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { AuthenticationService } from '../core/authentication.service';
import { access } from '../core/property-path.utils';
import { onErrorUndo } from '../core/reactive-repository.utils';
import { ContactRepository } from '../data/contact.repository';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { Mailbox } from '../data/mailbox.model';
import { GmailMessageParser } from './core/gmail-message-parser.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailService implements MailService {
  private user$ = inject(AuthenticationService).user$;
  private messageParser = inject(GmailMessageParser);
  private mailRepo = inject(MailRepository);
  private contactRepo = inject(ContactRepository);

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
      switchMap((message) => this.parseMessage(message)),
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
    const update = this.mailRepo.patch(mail.id, optimisticResult);
    return this.messageModifyApi({ userId: 'me', id: mail.id }, body).pipe(
      switchMap((response) => this.parseMessage(response.result)),
      switchMap((updated) => this.mailRepo.patch(mail.id, updated)),
      onErrorUndo(update),
    );
  }

  private parseMessage(message: gapi.client.gmail.Message): Observable<Mail> {
    // Wait for the user to be loaded into the repository.
    return this.user$.pipe(
      first(),
      map(() =>
        this.messageParser.parseFullMessage(
          message,
          (address) =>
            this.contactRepo.queryOne((e) => e.email === address.email)
              .snapshot ??
            access(
              this.contactRepo.insert({
                id: address.email,
                name: address.name,
                email: address.email,
              }),
              'curr',
            ),
        ),
      ),
    );
  }
}
