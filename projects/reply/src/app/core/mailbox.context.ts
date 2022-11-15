import { Injectable } from '@angular/core';

import { Reactive } from '@/app/common/reactive';

@Injectable({
  providedIn: 'root',
})
export class MailboxContext extends Reactive {
  current?: string;
}
