import { createReducer, on } from '@ngrx/store';

import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { MAILBOX_ACTIONS } from '../../entity/mailbox/mailbox.actions';
import { EntityCollection } from '../shared/entity-collection';
import { MailboxState } from './mailbox.state-model';

const mailboxInitialState: MailboxState = {
  mailboxes: new EntityCollection<Mailbox>((e) => e.id),
  mailboxesLoadingStatus: { type: 'idle' },
};

export const mailboxStateReducer = createReducer(
  mailboxInitialState,
  on(MAILBOX_ACTIONS.loadMailboxes, (s) => ({
    ...s,
    mailboxesLoadingStatus: { type: 'pending' } as const,
  })),
  on(MAILBOX_ACTIONS.loadMailboxesCompleted, (s, p) => ({
    ...s,
    mailboxes: s.mailboxes.upsert(...p.result),
    mailboxesLoadingStatus: { type: 'completed' } as const,
  })),
  on(MAILBOX_ACTIONS.loadMailboxesFailed, (s, p) => ({
    ...s,
    mailboxesLoadingStatus: { type: 'failed', error: p.error } as const,
  })),
);
