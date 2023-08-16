import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map } from 'rxjs';

import { BREAKPOINT_ACTIONS } from './breakpoint.actions';
import { BreakpointService } from './breakpoint.service';

@Injectable()
export class BreakpointEffects {
  private breakpointService = inject(BreakpointService);

  updateBreakpoints = createEffect(() =>
    this.breakpointService
      .observeBreakpoints({
        ['tablet-portrait']: '(min-width: 600px)',
        ['tablet-landscape']: '(min-width: 905px)',
        ['laptop']: '(min-width: 1240px)',
        ['desktop']: '(min-width: 1440px)',
      })
      .pipe(map((to) => BREAKPOINT_ACTIONS.breakpointsUpdated({ to }))),
  );
}
