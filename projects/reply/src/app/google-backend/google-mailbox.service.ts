import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mailbox } from '../data/mailbox.model';
import { MailboxRepository } from '../data/mailbox.repository';
import { MailboxService } from '../data/mailbox.service';
import { AUTHORIZED_GOOGLE_APIS } from './core/authorized-google-apis.token';
import { GMAIL_SYSTEM_MAILBOXES } from './core/gmail-system-mailboxes.token';

@Injectable()
export class GoogleMailboxService implements MailboxService {
  private apis$ = inject(AUTHORIZED_GOOGLE_APIS);
  private mailboxRepo = inject(MailboxRepository);
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.apis$.pipe(
      switchMap((apis) => apis.gmail.users.labels.list({ userId: 'me' })),
      map((response) => access(response.result, 'labels')),
      map((labels) => this.parseLabels(labels)),
      map((mailboxes) => [...this.systemMailboxes, ...mailboxes]),
      switchMap((mailboxes) =>
        combineLatest(mailboxes.map((m) => this.mailboxRepo.insertOrPatch(m))),
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
