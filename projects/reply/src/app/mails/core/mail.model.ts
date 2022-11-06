import { Contact } from '@/app/core/contact.model';

// TODO: multiple recipients
export interface Mail {
  id: string;
  subject: string;
  sender: Contact;
  recipient: Contact;
  sentAt: Date;
  content: string;
}
