import { inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BreakpointMap, BreakpointService } from './breakpoint.service';

export const BREAKPOINTS = new InjectionToken<Signal<BreakpointMap>>(
  'BREAKPOINTS',
  {
    providedIn: 'root',
    factory: () =>
      toSignal(
        inject(BreakpointService).observeBreakpoints({
          ['tablet-portrait']: '(min-width: 600px)',
          ['tablet-landscape']: '(min-width: 905px)',
          ['laptop']: '(min-width: 1240px)',
          ['desktop']: '(min-width: 1440px)',
        }),
        {
          initialValue: {
            ['tablet-portrait']: false,
            ['tablet-landscape']: false,
            ['laptop']: false,
            ['desktop']: false,
          },
        },
      ),
  },
);
