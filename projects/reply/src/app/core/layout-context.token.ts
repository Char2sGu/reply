import {
  inject,
  InjectionToken,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { NavigationStart, Params, Router } from '@angular/router';
import { filter } from 'rxjs';

export const LAYOUT_CONTEXT = new InjectionToken<WritableSignal<LayoutContext>>(
  'LAYOUT_CONTEXT',
  {
    providedIn: 'root',
    factory: () => {
      const router = inject(Router);
      const context = signal({
        contentFavored: false,
        navFabConfig: null,
        navBottomActions: null,
      });
      router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe(() => context.mutate((c) => (c.contentFavored = false)));
      return context;
    },
  },
);

export interface LayoutContext {
  contentFavored: boolean;
  navFabConfig: LayoutNavFabConfig | null;
  navBottomActions: TemplateRef<never> | null;
}

export interface LayoutNavFabConfig {
  text: string;
  icon: TemplateRef<never>;
  link: string;
  linkParams?: Params;
}
