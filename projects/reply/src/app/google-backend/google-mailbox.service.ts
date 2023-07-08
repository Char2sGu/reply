import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { access } from '../core/property-path.utils';
import { Mailbox, SystemMailboxName } from '../data/mailbox.model';
import { MailboxRepository } from '../data/mailbox.repository';
import { MailboxService } from '../data/mailbox.service';
import { AUTHORIZED_GOOGLE_APIS } from './core/authorized-google-apis.token';

@Injectable()
export class GoogleMailboxService implements MailboxService {
  private apis$ = inject(AUTHORIZED_GOOGLE_APIS);
  private mailboxRepo = inject(MailboxRepository);

  private systemMailboxesToMatch = new Set<SystemMailboxName>([
    SystemMailboxName.Inbox,
    SystemMailboxName.Starred,
    SystemMailboxName.Sent,
    SystemMailboxName.Trash,
    SystemMailboxName.Spam,
    SystemMailboxName.Drafts,
  ]);

  loadMailboxes(): Observable<Mailbox[]> {
    return this.apis$.pipe(
      switchMap((apis) => apis.gmail.users.labels.list({ userId: 'me' })),
      map((response) => access(response.result, 'labels')),
      map((labels) => this.parseLabels(labels)),
      switchMap((mailboxes) =>
        combineLatest(mailboxes.map((m) => this.mailboxRepo.insertOrPatch(m))),
      ),
    );
  }

  private parseLabels(labels: gapi.client.gmail.Label[]): Mailbox[] {
    const mailboxes = labels.map((label) => this.parseLabel(label));
    for (const name of this.systemMailboxesToMatch)
      mailboxes.push({ id: `system-${name}`, name, type: 'system' });
    return mailboxes.filter(Boolean) as Mailbox[];
  }

  private parseLabel(label: gapi.client.gmail.Label): Mailbox | null {
    if (label.type !== 'system')
      return {
        id: access(label, 'id'),
        name: access(label, 'name'),
        type: 'user',
      };

    const mapping = {
      ['INBOX']: SystemMailboxName.Inbox,
      ['STARRED']: SystemMailboxName.Starred,
      ['SENT']: SystemMailboxName.Sent,
      ['TRASH']: SystemMailboxName.Trash,
      ['SPAM']: SystemMailboxName.Spam,
      ['DRAFT']: SystemMailboxName.Drafts,
    };

    const isKnown = access(label, 'name') in mapping;
    if (!isKnown) return null;
    const labelName = access(label, 'name') as keyof typeof mapping;
    const mailboxName = mapping[labelName];
    this.systemMailboxesToMatch.delete(mailboxName);
    return {
      id: access(label, 'id'),
      name: mapping[labelName],
      type: 'system',
    };
  }
}
