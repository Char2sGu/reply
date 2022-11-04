import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Mail } from './mail.model';
import { MAILS } from './mails';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  mails$: Observable<Mail[]> = of(MAILS);
  private mailsRead = new WeakSet<Mail>();

  constructor() {}

  markMailAsRead(mail: Mail): void {
    this.mailsRead.add(mail);
  }

  isMailRead(mail: Mail): boolean {
    return this.mailsRead.has(mail);
  }
}
