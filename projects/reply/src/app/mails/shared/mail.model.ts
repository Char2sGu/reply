import { Contact } from '@/app/shared/contact.model';

export interface Mail {
  id: string;
  subject: string;
  sender: Contact;
  recipient: Contact;
  sentAt: Date;
  content: string;
}
