import { Mail } from '@/app/data/mail/mail.model';

import { ActionStatus } from '../core/action-status';

export interface MailState {
  mails: Mail[];
  mailsLoadingStatus: ActionStatus;
}
