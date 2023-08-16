import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from '@/app/entity/account/account.model';
import { Contact } from '@/app/entity/contact/contact.model';

import { generateActionGroupEvents } from './action-generator';
import { Authorization } from './auth/authorization.model';

export const AUTHENTICATION_ACTIONS = createActionGroup({
  source: 'authentication',
  events: {
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
