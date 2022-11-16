import { Injectable, TemplateRef } from '@angular/core';
import { NavigationStart, Params, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Reactive } from '../common/reactive';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext extends Reactive {
  contentFavored = false;

  navFabConfig?: LayoutNavFabConfig;
  navBottomActions?: TemplateRef<never>;

  constructor(router: Router) {
    super();
    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => (this.contentFavored = false));
  }
}

export interface LayoutNavFabConfig {
  text: string;
  icon: TemplateRef<never>;
  link: string;
  linkParams?: Params;
}
