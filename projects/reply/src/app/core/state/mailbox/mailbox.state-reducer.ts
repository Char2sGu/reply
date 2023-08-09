import { createReducer, on } from '@ngrx/store';

import { status } from '../core/action-status';
import { MAILBOX_ACTIONS } from './mailbox.actions';
import { MailboxState } from './mailbox.state-model';

const mailboxInitialState: MailboxState = {
  mailboxes: [],
  mailboxesLoadingStatus: { type: 'idle' },
};

export const mailboxStateReducer = createReducer(
  mailboxInitialState,
  on(MAILBOX_ACTIONS.loadMailboxes, (s) => ({
    ...s,
    mailboxesLoadingStatus: status({ type: 'pending' }),
  })),
  on(MAILBOX_ACTIONS.loadMailboxesCompleted, (s, p) => ({
    ...s,
    mailboxes: p.result,
    mailboxesLoadingStatus: status({ type: 'completed' }),
  })),
  on(MAILBOX_ACTIONS.loadMailboxesFailed, (s, p) => ({
    ...s,
    mailboxesLoadingStatus: status({ type: 'failed', error: p.error }),
  })),
);
