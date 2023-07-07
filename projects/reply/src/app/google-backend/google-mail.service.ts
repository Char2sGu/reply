import { inject, Injectable } from '@angular/core';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';

import { AuthenticationService } from '../core/authentication.service';
import { assertPropertyPaths } from '../core/property-path.util';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';
import { GOOGLE_APIS } from './core/google-apis.token';
import { GoogleMessageParser } from './core/google-message-parser.service';

@Injectable()
export class GoogleMailService {
  private apis$ = inject(GOOGLE_APIS);
  private authorized$ = inject(AuthenticationService).authorized$;
  private messageParser = inject(GoogleMessageParser);
  private mailRepo = inject(MailRepository);

  private authorizedApis$ = combineLatest([this.apis$, this.authorized$]).pipe(
    filter(([, authorized]) => authorized),
    map(([apis]) => apis),
    take(1),
    shareReplay(1),
  );

  loadMailList(): Observable<Mail[]> {
    return this.authorizedApis$.pipe(
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
    return this.authorizedApis$.pipe(
      switchMap((apis) => apis.gmail.users.messages.get({ userId: 'me', id })),
      map((response) => response.result),
      switchMap((message) => this.messageParser.parseMessage(message)),
      switchMap((mail) => this.mailRepo.insertOrPatch(mail)),
    );
  }
}
