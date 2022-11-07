import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SearchButtonComponent } from '../standalone/search-button/search-button.component';

@Injectable({
  providedIn: 'root',
})
export class LayoutConfig {
  contentFavored;
  navFabConfig;
  navBottomActionsPortal: Portal<unknown>;

  readonly value$ = new BehaviorSubject(this);

  constructor() {
    this.contentFavored = false;
    this.navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };
    this.navBottomActionsPortal = new ComponentPortal(SearchButtonComponent);
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
