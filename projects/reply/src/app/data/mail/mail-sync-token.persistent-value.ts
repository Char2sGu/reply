import { Injectable } from '@angular/core';

import { PersistentValue } from '../../core/persistent-value';

@Injectable({
  providedIn: 'root',
})
export class MailSyncTokenPersistentValue extends PersistentValue<string> {
  readonly key = 'mail-sync-token';
}
