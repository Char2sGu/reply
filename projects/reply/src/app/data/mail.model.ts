import { Contact } from './contact.model';
import { Mailbox } from './mailbox.model';

export interface Mail {
  id: string;
  subject?: string;
  sender: Contact['id'];
  recipients: Contact['id'][];
  sentAt: Date;
  snippet: string;
  content: string;
  isStarred: boolean;
  isRead: boolean;
  mailbox: Mailbox['id'];
}
