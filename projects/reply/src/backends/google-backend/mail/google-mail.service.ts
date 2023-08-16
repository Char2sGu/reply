import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { Page } from '@/app/entity/core/page.model';

import { access } from '../../../app/core/property-path.utils';
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
}
