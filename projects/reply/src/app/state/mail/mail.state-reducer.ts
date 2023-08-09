import { createReducer, on } from '@ngrx/store';

import { MAIL_ACTIONS } from './mail.actions';
import { MailState } from './mail.state-model';

const mailInitialState: MailState = {
  mails: [],
  mailsLoadingStatus: { type: 'idle' },
};

export const mailStateReducer = createReducer(
  mailInitialState,
  on(MAIL_ACTIONS.loadMails, (s) => ({
    ...s,
    mailsLoadingStatus: { type: 'pending' } as const,
  })),
  on(MAIL_ACTIONS.loadMailsCompleted, (s, p) => ({
    ...s,
    mails: p.result,
    mailsLoadingStatus: { type: 'completed' } as const,
  })),
  on(MAIL_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
