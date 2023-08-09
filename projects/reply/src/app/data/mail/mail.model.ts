import { Mailbox } from '../mailbox/mailbox.model';

export interface Mail {
  id: string;
  subject?: string;
  sender: MailParticipant;
  recipients?: MailParticipant[];
  sentAt: Date;
  snippet?: string;
  content: string;
  contentType: 'plain-text' | 'html';
  isStarred: boolean;
  isRead: boolean;
  type: 'received' | 'sent' | 'draft';
  mailbox?: Mailbox['id'];
}

export interface MailParticipant {
  name?: string;
  email: string;
}
