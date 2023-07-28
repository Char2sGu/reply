import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Contact } from '@/app/data/contact/contact.model';
import { Mail } from '@/app/data/mail/mail.model';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

@Injectable({
  providedIn: 'root',
})
export class Database extends Dexie {
  mails!: Table<Mail, Mail['id']>;
  mailboxes!: Table<Mailbox, Mailbox['id']>;
  contacts!: Table<Contact, Contact['id']>;

  constructor() {
    super('reply');
    this.version(1).stores({
      mails: 'id',
      mailboxes: 'id',
      contacts: 'id',
    });
  }
}
