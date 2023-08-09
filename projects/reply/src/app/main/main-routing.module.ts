import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, firstValueFrom } from 'rxjs';

import { CORE_ACTIONS } from '../core/state/core.actions';
import { CORE_STATE } from '../core/state/core.state-entry';
import { BaseFoundationComponent } from './base-foundation/base-foundation.component';
import { MainComponent } from './main.component';
import { UpperFoundationComponent } from './upper-foundation/upper-foundation.component';

const dataInitializer: CanActivateFn = async () => {
  const store = inject(Store);

  const authenticate$ = store
    .select(CORE_STATE.selectAuthenticated)
    .pipe(filter(Boolean));
  await firstValueFrom(authenticate$);

  store.dispatch(CORE_ACTIONS.loadContacts());
  store.dispatch(CORE_ACTIONS.loadMailboxes());
  store.dispatch(CORE_ACTIONS.loadMails());

  const load$ = combineLatest([
    store
      .select(CORE_STATE.selectContactsLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
    store
      .select(CORE_STATE.selectMailboxesLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
    store
      .select(CORE_STATE.selectMailsLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
  ]);
  await firstValueFrom(load$);

  return true;
};

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [dataInitializer],
    children: [
      {
        path: '',
        component: BaseFoundationComponent,
        data: { animationId: 'base' },
        children: [
          {
            matcher: (segments) => {
              if (!segments.length) return null;
              const path = segments.join('/');
              if (path.startsWith('mail'))
                return { consumed: [], posParams: {} };
              return null;
            },
            loadChildren: () =>
              import('../mails/mails.module').then((m) => m.MailsModule),
          },
        ],
      },
      {
        path: '',
        component: UpperFoundationComponent,
        data: { animationId: 'upper' },
        children: [
          {
            path: 'compose',
            loadChildren: () =>
              import('../compose/compose.module').then((m) => m.ComposeModule),
          },
          {
            path: 'search',
            loadChildren: () =>
              import('../search/search.module').then((m) => m.SearchModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
