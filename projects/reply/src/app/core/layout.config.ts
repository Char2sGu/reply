import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';

import { SearchButtonComponent } from '../standalone/search-button/search-button.component';
import { RouterStatus } from './router-status.state';

@Injectable({
  providedIn: 'root',
})
export class LayoutConfig {
  contentFavored;
  navFabConfig;
  navBottomActionsPortal: Portal<unknown>;

  readonly value$ = new BehaviorSubject(this);

  constructor(routerStatus: RouterStatus) {
    this.contentFavored = false;
    this.navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };
    this.navBottomActionsPortal = new ComponentPortal(SearchButtonComponent);

    routerStatus.navigating$
      .pipe(filter((navigating) => navigating))
      .subscribe(() => (this.contentFavored = false));

    return new Proxy(this, {
      set: (target, prop, value) => {
        const exists = prop in target;
        if (!exists) return false;

        const key = prop as keyof this;
        if (target[key] === value) return true;
        target[key] = value;
        target.value$.next(target);
        return true;
      },
    });
  }
}
