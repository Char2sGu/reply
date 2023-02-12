import { Injectable } from '@angular/core';

import { ReactiveObject } from '@/app/common/reactivity';

@Injectable({
  providedIn: 'root',
})
export class NavigationContext extends ReactiveObject {
  latestMailboxUrl?: string;
  latestMailboxIndex?: number;
}
