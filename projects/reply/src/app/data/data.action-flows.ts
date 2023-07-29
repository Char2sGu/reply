import { inject, Injectable } from '@angular/core';
import { combineLatest, first, map, Observable } from 'rxjs';

import { ActionFlow, useActionFlow } from '../core/action-flow';
import { AuthenticationService } from '../core/authentication.service';
import { ContactService } from './contact/contact.service';
import {
  LoadMoreMailsActionFlow,
  SyncMailsActionFlow,
  UpdateMailSyncTokenActionFlow,
} from './mail/mail.action-flows';
import { MailDatabase } from './mail/mail.database';
import { MailboxService } from './mailbox/mailbox.service';

@Injectable({
  providedIn: 'root',
})
export class ResetAndLoadInitialDataActionFlow implements ActionFlow {
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactService);
  private mailboxService = inject(MailboxService);
  private mailDb = inject(MailDatabase);

  private loadMoreMails = useActionFlow(LoadMoreMailsActionFlow);
  private updateMailSyncToken = useActionFlow(UpdateMailSyncTokenActionFlow);

  execute(): Observable<void> {
    return combineLatest([
      this.authService.user$,
      this.contactService.loadContacts(),
      this.mailboxService.loadMailboxes(),
      this.mailDb.clear(),
      this.loadMoreMails({ reset: true }),
      this.updateMailSyncToken(),
    ]).pipe(
      first(),
      map(() => undefined),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoadIncrementalDataActionFlow implements ActionFlow {
  private authService = inject(AuthenticationService);
  private contactService = inject(ContactService);
  private mailboxService = inject(MailboxService);

  private syncMails = useActionFlow(SyncMailsActionFlow);

  execute(): Observable<void> {
    return combineLatest([
      this.authService.user$,
      this.contactService.loadContacts(),
      this.mailboxService.loadMailboxes(),
      this.syncMails(),
    ]).pipe(
      first(),
      map(() => undefined),
    );
  }
}
