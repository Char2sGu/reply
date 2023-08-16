import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BreakpointMap, BreakpointService } from './breakpoint.service';

export function useBreakpoints(): Signal<BreakpointMap> {
  const breakpoints$ = inject(BreakpointService).breakpoints$;
  return toSignal(breakpoints$, {
    initialValue: {
      ['tablet-portrait']: false,
      ['tablet-landscape']: false,
      ['laptop']: false,
      ['desktop']: false,
    },
  });
}
