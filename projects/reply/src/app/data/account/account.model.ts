import { Contact } from '../contact/contact.model';

export interface Account {
  id: string;
  profile: Contact['id'];
  authorizedAt: Date;
}
