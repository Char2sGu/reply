import { createActionGroup, props } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';
import { generateActionGroupEvents } from '@/app/state/core/action-generator';

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
