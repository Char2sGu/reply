import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Reactive } from '../common/reactive';
import { SearchButtonComponent } from '../standalone/search-button/search-button.component';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext extends Reactive {
  contentFavored;
  navFabConfig;
  navBottomActionsPortal: Portal<unknown>;

  constructor(router: Router) {
    super();

    this.contentFavored = false;
    this.navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };
    this.navBottomActionsPortal = new ComponentPortal(SearchButtonComponent);

    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => (this.contentFavored = false));
  }
}
