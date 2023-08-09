import { createReducer, on } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';

import { EntityCollection } from '../core/entity-collection';
import { MAIL_ACTIONS } from './mail.actions';
import { MailState } from './mail.state-model';

const mailInitialState: MailState = {
  mails: new EntityCollection<Mail>((e) => e.id),
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
    mails: s.mails.upsert(...p.result),
    mailsLoadingStatus: { type: 'completed' } as const,
  })),
  on(MAIL_ACTIONS.loadMailsFailed, (s, p) => ({
    ...s,
    mailsLoadingStatus: { type: 'failed', error: p.error } as const,
  })),

  on(MAIL_ACTIONS.toggleMailStarredStatus, (s, p) => ({
    ...s,
    mails: s.mails.upsert({ ...p.mail, isStarred: !p.mail.isStarred }),
  })),
  on(MAIL_ACTIONS.toggleMailStarredStatusCompleted, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.result),
  })),
  on(MAIL_ACTIONS.toggleMailStarredStatusFailed, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.mail),
  })),
);
