import { Contact } from '@/app/core/contact.model';

export interface Mail {
  id: string;
  subject: string;
  sender: Contact;
  recipient: Contact;
  sentAt: Date;
  content: string;
}
