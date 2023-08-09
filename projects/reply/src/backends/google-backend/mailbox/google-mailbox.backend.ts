import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { access } from '../../../app/core/property-path.utils';
import { MailboxBackend } from '../../../app/entity/mailbox/mailbox.backend';
import { Mailbox } from '../../../app/entity/mailbox/mailbox.model';
import { GMAIL_SYSTEM_MAILBOXES } from '../core/gmail-system-mailboxes.object';
import { useGoogleApi } from '../core/google-apis.utils';

@Injectable()
export class GoogleMailboxBackend implements MailboxBackend {
  private systemMailboxes = inject(GMAIL_SYSTEM_MAILBOXES);

  private labelListApi = useGoogleApi((a) => a.gmail.users.labels.list);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.labelListApi({ userId: 'me' }).pipe(
      map((response) => access(response, 'labels')),
      map((labels) => this.parseLabels(labels)),
      map((mailboxes) => [...this.systemMailboxes, ...mailboxes]),
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
