import { Contact } from './contact.model';
import { Mailbox } from './mailbox.model';

export interface Mail {
  id: string;
  subject?: string;
  sender: Contact['id'];
  recipients?: Contact['id'][];
  sentAt: Date;
  snippet?: string;
  content: string;
  contentType: 'plain-text' | 'html';
  isStarred: boolean;
  isRead: boolean;
  type: 'received' | 'sent' | 'draft';
  mailbox?: Mailbox['id'];
}
