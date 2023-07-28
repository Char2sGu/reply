import { inject, Injectable, NgModule } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import {
  catchError,
  combineLatest,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { useActionFlow } from './core/action-flow';
import { AuthenticationService } from './core/authentication.service';
import { ContactService } from './data/contact/contact.service';
import { populateRepositoryWithDatabase } from './data/core/entity-database.utils';
import {
  ReloadAllMailsActionFlow,
  SyncMailsActionFlow,
} from './data/mail/mail.action-flows';
import { MailDatabase } from './data/mail/mail.database';
import { MailRepository } from './data/mail/mail.repository';
import { MailSyncTokenPersistentValue } from './data/mail/mail-sync-token.persistent-value';
import { MailboxService } from './data/mailbox/mailbox.service';

const authorized: CanMatchFn = () =>
  inject(AuthenticationService).authorization$.pipe(map((a) => !!a));
const unauthorized: CanMatchFn = () =>
  inject(AuthenticationService).authorization$.pipe(map((a) => !a));

const dataInitializer: CanActivateFn = () =>
  combineLatest([
    inject(AuthenticationService).user$,
    inject(ContactService).loadContacts(),
    initializeMails(),
    inject(MailboxService).loadMailboxes(),
  ]).pipe(
    first(),
    map(() => true),
  );

function initializeMails(): Observable<unknown> {
  const mailDb = inject(MailDatabase);
  const mailRepo = inject(MailRepository);
  const mailSyncToken = inject(MailSyncTokenPersistentValue);
  const syncMails = useActionFlow(SyncMailsActionFlow);
  const reloadAllMails = useActionFlow(ReloadAllMailsActionFlow);
  if (!mailSyncToken.get()) return reloadAllMails();
  return populateRepositoryWithDatabase(mailRepo, mailDb).pipe(
    switchMap(() => syncMails()),
    catchError(() => reloadAllMails()),
  );
}

const routes: Routes = [
  {
    path: '',
    canMatch: [unauthorized],
    children: [
      {
        path: 'auth',
        data: { animationId: 'auth' },
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        redirectTo: 'auth',
      },
    ],
  },
  {
    path: '',
    canMatch: [authorized],
    canActivate: [dataInitializer],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mailboxes/Inbox/mails',
      },
      {
        path: '',
        data: { animationId: 'main' },
        loadChildren: () =>
          import('./main/main.module').then((m) => m.MainModule),
      },
      {
        path: '**',
        redirectTo: 'mailboxes/Inbox/mails',
      },
    ],
  },
];

@Injectable()
export class AppTitleStrategy extends DefaultTitleStrategy {
  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const title = super.buildTitle(snapshot);
    return title && `${title} | Reply`;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
})
export class AppRoutingModule {}
