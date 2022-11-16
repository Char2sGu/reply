import { Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Reactive } from '../common/reactive';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext extends Reactive {
  contentFavored: boolean = false;

  navFabConfig?: LayoutNavFabConfig;
  navBottomActionsPortal?: Portal<unknown>;

  constructor(router: Router) {
    super();
    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => (this.contentFavored = false));
  }
}

export interface LayoutNavFabConfig {
  text: string;
  icon: Portal<unknown>;
  link: string;
}
