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
    mails: s.mails.upsert(p.params.mail),
  })),

  on(MAIL_ACTIONS.toggleMailReadStatus, (s, p) => ({
    ...s,
    mails: s.mails.upsert({ ...p.mail, isRead: !p.mail.isRead }),
  })),
  on(MAIL_ACTIONS.toggleMailReadStatusCompleted, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.result),
  })),
  on(MAIL_ACTIONS.toggleMailReadStatusFailed, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.params.mail),
  })),

  on(MAIL_ACTIONS.moveMailToMailbox, (s, p) => ({
    ...s,
    mails: s.mails.upsert({ ...p.mail, mailbox: p.mailbox?.id }),
  })),
  on(MAIL_ACTIONS.moveMailToMailboxCompleted, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.result),
  })),
  on(MAIL_ACTIONS.moveMailToMailboxFailed, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.params.mail),
  })),

  on(MAIL_ACTIONS.deleteMail, (s, p) => ({
    ...s,
    mails: s.mails.delete(p.mail.id),
  })),
  on(MAIL_ACTIONS.deleteMailFailed, (s, p) => ({
    ...s,
    mails: s.mails.upsert(p.params.mail),
  })),
);
