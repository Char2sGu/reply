import { createActionGroup, props } from '@ngrx/store';

import { BreakpointMap } from './breakpoint.service';

export const BREAKPOINT_ACTIONS = createActionGroup({
  source: 'breakpoint',
  events: {
    breakpointsUpdated: props<{ to: BreakpointMap }>(),
  },
});
