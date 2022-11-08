import { Contact } from '@/app/core/contact.model';

export interface Mail {
  id: string;
  subject: string;
  sender: Contact;
  recipients: Contact[];
  sentAt: Date;
  content: string;
  mailboxName: string;
}
