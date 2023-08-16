import { Mail } from '@/app/entity/mail/mail.model';

import { ActionStatus } from '../../core/action-status';
import { EntityCollection } from '../shared/entity-collection';

export interface MailState {
  mails: EntityCollection<Mail>;
  mailsLoadingStatus: ActionStatus;
  syncToken: string | null;
}
