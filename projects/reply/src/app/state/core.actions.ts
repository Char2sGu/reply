import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Authorization } from '../core/auth/authorization.service';
import { BreakpointMap } from '../core/breakpoint.service';
import { Account } from '../entity/account/account.model';
import { Contact } from '../entity/contact/contact.model';
import { generateActionGroupEvents } from './core/action-generator';

export const CORE_ACTIONS = createActionGroup({
  source: 'core',
  events: {
    breakpointsUpdated: props<{ to: BreakpointMap }>(),
    ...generateActionGroupEvents({
      name: 'authenticate' as const,
      params: props<{ hint?: string }>(),
      events: {
        completed: props<{
          result: {
            authorization: Authorization;
            user: Contact;
            account: Account;
          };
        }>(),
        cancelled: emptyProps(),
        failed: props<{ error: Error }>(),
        expired: emptyProps(),
      },
    }),
  },
});
