import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';

import { ActionFlow, useActionFlow } from '@/app/core/action-flow';

import { MailService } from './mail.service';
import { MailSyncTokenPersistentValue } from './mail-sync-token.persistent-value';

@Injectable({
  providedIn: 'root',
})
export class UpdateMailSyncTokenActionFlow implements ActionFlow {
  private mailService = inject(MailService);
  private mailSyncToken = inject(MailSyncTokenPersistentValue);

  execute(): Observable<void> {
    return this.mailService.obtainSyncToken().pipe(
      tap((syncToken) => this.mailSyncToken.set(syncToken)),
      map(() => undefined),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class SyncMailsActionFlow implements ActionFlow {
  private mailService = inject(MailService);
  private mailSyncToken = inject(MailSyncTokenPersistentValue);
  private updateSyncToken = useActionFlow(UpdateMailSyncTokenActionFlow);

  execute(): Observable<void> {
    const syncToken = this.mailSyncToken.get();
    if (!syncToken) throw new Error('Missing sync token');
    return this.mailService
      .syncMails(syncToken)
      .pipe(switchMap(() => this.updateSyncToken()));
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoadMoreMailsActionFlow implements ActionFlow {
  private mailService = inject(MailService);

  private next?: string;

  execute(payload?: { reset?: boolean }): Observable<void> {
    if (payload?.reset) this.next = undefined;
    return this.mailService.loadMails(this.next).pipe(
      tap((page) => (this.next = page.next)),
      switchMap((page) => page.results$),
      map(() => undefined),
    );
  }
}
