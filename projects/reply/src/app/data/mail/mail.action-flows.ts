import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';

import { ActionFlow, useActionFlow } from '@/app/core/action-flow';

import { MailDatabase } from './mail.database';
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
export class ReloadAllMailsActionFlow implements ActionFlow {
  private mailDb = inject(MailDatabase);
  private mailService = inject(MailService);
  private updateSyncToken = useActionFlow(UpdateMailSyncTokenActionFlow);

  execute(): Observable<void> {
    return combineLatest([
      this.mailDb.clear(),
      this.loadMails(),
      this.updateSyncToken(),
    ]).pipe(map(() => undefined));
  }

  private loadMails(page?: string): Observable<void> {
    return this.mailService.loadMails(page).pipe(
      switchMap((page) =>
        combineLatest([
          page.results$,
          page.next ? this.loadMails(page.next) : of(null),
        ]),
      ),
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
