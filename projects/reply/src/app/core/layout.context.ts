import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { EventEmitter, Injectable } from '@angular/core';
import {
  debounceTime,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

import { SearchButtonComponent } from '../standalone/search-button/search-button.component';
import { RouterStatus } from './router-status.state';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext {
  contentFavored;
  navFabConfig;
  navBottomActionsPortal: Portal<unknown>;

  readonly value$: Observable<this>;
  private assign$ = new EventEmitter();

  constructor(routerStatus: RouterStatus) {
    this.contentFavored = false;
    this.navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };
    this.navBottomActionsPortal = new ComponentPortal(SearchButtonComponent);

    this.value$ = this.assign$.pipe(
      // Combine multiple assigns as well as trigger a new change detection
      // cycle.
      // Some components that is close to the root will not be able to be
      // checked if we use the current running change detection cycle when
      // the config is updated in an OnInit life-cycle hook.
      debounceTime(0),

      startWith(this),
      map(() => this),
      shareReplay(1),
    );

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
        target.assign$.emit();
        return true;
      },
    });
  }
}
