import { Injectable } from '@angular/core';

import { Reactive } from '@/app/common/reactive';

@Injectable({
  providedIn: 'root',
})
export class NavigationContext extends Reactive {
  latestMailboxUrl?: string;
  latestMailboxIndex?: number;
}
