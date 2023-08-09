import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Authorization } from '../core/auth/authorization.service';
import { BreakpointMap } from '../core/breakpoint.service';
import { Account } from '../entity/account/account.model';
import { Contact } from '../entity/contact/contact.model';

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
