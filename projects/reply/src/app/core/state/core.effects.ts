import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';

import { AccountService } from '@/app/data/account/account.service';
import { ContactBackend } from '@/app/data/contact/contact.backend';
import { MailBackend } from '@/app/data/mail/mail.backend';
import { MailboxBackend } from '@/app/data/mailbox/mailbox.backend';

import { AuthenticationService } from '../auth/authentication.service';
import { BreakpointService } from '../breakpoint.service';
import { CORE_ACTIONS } from './core.actions';

@Injectable()
export class CoreEffects {
  private actions$ = inject(Actions);
  private breakpointService = inject(BreakpointService);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private contactService = inject(ContactBackend);
  private mailService = inject(MailBackend);
  private mailboxService = inject(MailboxBackend);

  updateBreakpoints = createEffect(() =>
    this.breakpointService
      .observeBreakpoints({
        ['tablet-portrait']: '(min-width: 600px)',
        ['tablet-landscape']: '(min-width: 905px)',
        ['laptop']: '(min-width: 1240px)',
        ['desktop']: '(min-width: 1440px)',
      })
      .pipe(map((to) => CORE_ACTIONS.breakpointsUpdated({ to }))),
  );

  authenticate = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.authenticate),
      concatMap((a) => this.authService.requestAuthorization(a.hint)),
      switchMap((authorization) => {
        if (!authorization) return of(CORE_ACTIONS.authenticateCancelled());
        return of(null).pipe(
          concatMap(() => this.contactService.loadUser()),
          concatLatestFrom((user) => this.accountService.saveAccount(user)),
          map(([user, account]) => ({ authorization, user, account })),
          map((result) => CORE_ACTIONS.authenticateCompleted({ result })),
        );
      }),
      catchError((error) => of(CORE_ACTIONS.authenticateFailed({ error }))),
    ),
  );

  loadAccounts = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadAccounts),
      concatMap(() => this.accountService.loadAccounts()),
      map((result) => CORE_ACTIONS.loadAccountsCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadAccountsFailed({ error }))),
    ),
  );

  loadContacts = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadContacts),
      concatMap(() => this.contactService.loadContacts()),
      map((result) => CORE_ACTIONS.loadContactsCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadContactsFailed({ error }))),
    ),
  );

  loadMails = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadMails),
      concatMap(() => this.mailService.loadMailPage()),
      map((r) => r.results),
      map((result) => CORE_ACTIONS.loadMailsCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadMailsFailed({ error }))),
    ),
  );

  loadMailboxes = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.loadMailboxes),
      concatMap(() => this.mailboxService.loadMailboxes()),
      map((result) => CORE_ACTIONS.loadMailboxesCompleted({ result })),
      catchError((error) => of(CORE_ACTIONS.loadMailboxesFailed({ error }))),
    ),
  );
}
