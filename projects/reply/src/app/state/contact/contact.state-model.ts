import { Contact } from '@/app/entity/contact/contact.model';

import { ActionStatus } from '../core/action-status';

export interface ContactState {
  currentId: Contact['id'] | null;
  contacts: Contact[];
  contactsLoadingStatus: ActionStatus;
}
