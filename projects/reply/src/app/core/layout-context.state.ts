import { TemplateRef } from '@angular/core';
import { Params } from '@angular/router';

import { StateInjectionToken } from './state';

export const LAYOUT_CONTEXT = new StateInjectionToken<LayoutContext>(
  'LAYOUT_CONTEXT',
  {
    contentFavored: false,
    navFabConfig: null,
    navBottomActions: null,
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
