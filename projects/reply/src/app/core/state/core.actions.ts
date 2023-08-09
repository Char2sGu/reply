import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from '@/app/data/account/account.model';
import { Contact } from '@/app/data/contact/contact.model';

import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';

export const CORE_ACTIONS = createActionGroup({
  source: 'core',
  events: {
    breakpointsUpdated: props<{ to: BreakpointMap }>(),

    authenticate: (p: { hint?: string } = {}) => p,
    authenticateCompleted: props<{
      result: { authorization: Authorization; user: Contact; account: Account };
    }>(),
    authenticateCancelled: emptyProps(),
    authenticateFailed: props<{ error: Error }>(),
  },
});
