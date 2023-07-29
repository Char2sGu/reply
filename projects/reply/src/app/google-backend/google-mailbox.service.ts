import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mailbox } from '../data/mailbox/mailbox.model';
import { MailboxRepository } from '../data/mailbox/mailbox.repository';
import { MailboxService } from '../data/mailbox/mailbox.service';
import { GMAIL_SYSTEM_MAILBOXES } from './core/gmail-system-mailboxes.token';
import { useGoogleApi } from './core/google-apis.utils';

@Injectable()
export class GoogleMailboxService implements MailboxService {
  private mailboxRepo = inject(MailboxRepository);
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  private labelListApi = useGoogleApi((a) => a.gmail.users.labels.list);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.labelListApi({ userId: 'me' }).pipe(
      map((response) => access(response.result, 'labels')),
      map((labels) => this.parseLabels(labels)),
      map((mailboxes) => [...this.systemMailboxes, ...mailboxes]),
      switchMap((mailboxes) =>
        combineLatest(mailboxes.map((m) => this.mailboxRepo.record(m))),
      ),
    );
  }

  private parseLabels(labels: gapi.client.gmail.Label[]): Mailbox[] {
    const mailboxes = labels.map((label) => this.parseLabel(label));
    return mailboxes.filter((m): m is NonNullable<typeof m> => !!m);
  }

  private parseLabel(label: gapi.client.gmail.Label): Mailbox | null {
    if (label.type === 'system') return null;
    return {
      id: access(label, 'id'),
      name: access(label, 'name'),
    };
  }
}
