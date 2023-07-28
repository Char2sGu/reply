import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mailbox } from './mailbox.model';

@Injectable()
export abstract class MailboxService {
  abstract loadMailboxes(): Observable<Mailbox[]>;
}
