import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { assertPropertyPaths } from '../core/property-path.util';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { MailService } from '../data/mail.service';
import { AUTHORIZED_GOOGLE_APIS } from './core/authorized-google-apis.token';
import { GoogleMessageParser } from './core/google-message-parser.service';

@Injectable()
export class GoogleMailService implements MailService {
  private apis$ = inject(AUTHORIZED_GOOGLE_APIS);
  private messageParser = inject(GoogleMessageParser);
  private mailRepo = inject(MailRepository);

  loadMails(): Observable<Mail[]> {
    return this.apis$.pipe(
      switchMap((apis) => apis.gmail.users.messages.list({ userId: 'me' })),
      map((r) => assertPropertyPaths(r, ['result.messages']).result.messages),
      switchMap((messages) =>
        combineLatest(
          messages.map((m) => this.loadMail(assertPropertyPaths(m, ['id']).id)),
        ),
      ),
    );
  }

  loadMail(id: string): Observable<Mail> {
    return this.apis$.pipe(
      switchMap((apis) => apis.gmail.users.messages.get({ userId: 'me', id })),
      map((response) => response.result),
      switchMap((message) => this.messageParser.parseMessage(message)),
      switchMap((mail) => this.mailRepo.insertOrPatch(mail)),
    );
  }
}
