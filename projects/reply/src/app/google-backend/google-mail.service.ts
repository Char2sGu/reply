import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { GmailMessageParser } from './core/gmail-message-parser.service';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailService implements MailService {
  private messageParser = inject(GmailMessageParser);
  private mailRepo = inject(MailRepository);

  private messageListApi = useGoogleApi((a) => a.gmail.users.messages.list);
  private messageGetApi = useGoogleApi((a) => a.gmail.users.messages.get);

  loadMails(): Observable<Mail[]> {
    return this.messageListApi({ userId: 'me' }).pipe(
      map((r) => access(r, 'result.messages')),
      switchMap((messages) =>
        combineLatest(messages.map((m) => this.loadMail(access(m, 'id')))),
      ),
    );
  }

  loadMail(id: string): Observable<Mail> {
    return this.messageGetApi({ userId: 'me', id }).pipe(
      map((response) => response.result),
      switchMap((message) => this.messageParser.parseFullMessage(message)),
      switchMap((mail) => this.mailRepo.insertOrPatch(mail)),
    );
  }
}
