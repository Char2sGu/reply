import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Contact } from '@/app/entity/contact/contact.model';
import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

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
