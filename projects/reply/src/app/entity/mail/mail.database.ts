import { inject, Injectable } from '@angular/core';

import { DexieEntityDatabase } from '../core/entity-database';
import { Database } from '../entitybase.service';
import { Mail } from './mail.model';

@Injectable({
  providedIn: 'root',
})
export class MailDatabase extends DexieEntityDatabase<Mail, Mail['id']> {
  protected readonly table = inject(Database).mails;
}
