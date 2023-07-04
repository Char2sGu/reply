import {
  InjectionToken,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { Params } from '@angular/router';

export const LAYOUT_CONTEXT = new InjectionToken<WritableSignal<LayoutContext>>(
  'LAYOUT_CONTEXT',
  {
    providedIn: 'root',
    factory: () =>
      signal({
        contentFavored: false,
        navFabConfig: null,
        navBottomActions: null,
      }),
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
