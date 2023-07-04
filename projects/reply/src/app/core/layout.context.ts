import { inject, Injectable, signal, TemplateRef } from '@angular/core';
import { NavigationStart, Params, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutContext {
  contentFavored = signal(false);

  navFabConfig = signal<LayoutNavFabConfig | null>(null);
  navBottomActions = signal<TemplateRef<never> | null>(null);

  constructor() {
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => this.contentFavored.set(false));
  }
}

export interface LayoutNavFabConfig {
  text: string;
  icon: TemplateRef<never>;
  link: string;
  linkParams?: Params;
}
