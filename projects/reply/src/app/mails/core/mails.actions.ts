import { createActionGroup, props } from '@ngrx/store';

import { generateActionGroupEvents } from '@/app/core/action-generator';
import { Mail } from '@/app/entity/mail/mail.model';

export const MAILS_ACTIONS = createActionGroup({
  source: 'feature/mails',
  events: {
    ...generateActionGroupEvents({
      name: 'openMoveMailDialog' as const,
      params: props<{ mail: Mail }>(),
      events: {},
    }),
  },
});
