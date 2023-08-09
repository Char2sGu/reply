import { createReducer, on } from '@ngrx/store';

import { status } from '../core/action-status';
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
    mailsLoadingStatus: status({ type: 'pending' }),
  })),
  on(MAIL_ACTIONS.loadMailsCompleted, (s, p) => ({
    ...s,
    mails: p.result,
    mailsLoadingStatus: status({ type: 'completed' }),
  })),
  on(MAIL_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsLoadingStatus: status({ type: 'failed', error: p.error }),
  })),
);
