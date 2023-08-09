import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';

export const MAIL_ACTIONS = createActionGroup({
  source: 'mail',
  events: {
    loadMails: emptyProps(),
    loadMailsCompleted: props<{ result: Mail[] }>(),
    loadMailsFailed: props<{ error: Error }>(),
  },
});
