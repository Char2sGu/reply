import { Contact } from '@/app/entity/contact/contact.model';

import { ActionStatus } from '../../core/action-status';
import { EntityCollection } from '../shared/entity-collection';

export interface ContactState {
  currentId: Contact['id'] | null;
  contacts: EntityCollection<Contact>;
  contactsLoadingStatus: ActionStatus;
  syncToken: string | null;
}
