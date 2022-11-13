import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs';

import { Reactive } from '../common/reactive';
import { SearchButtonComponent } from '../standalone/search-button/search-button.component';
import { RouterStatus } from './router-status.state';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext extends Reactive {
  contentFavored;
  navFabConfig;
  navBottomActionsPortal: Portal<unknown>;

  constructor(routerStatus: RouterStatus) {
    super();

    this.contentFavored = false;
    this.navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };
    this.navBottomActionsPortal = new ComponentPortal(SearchButtonComponent);

    routerStatus.navigating$
      .pipe(filter((navigating) => navigating))
      .subscribe(() => (this.contentFavored = false));
  }
}
