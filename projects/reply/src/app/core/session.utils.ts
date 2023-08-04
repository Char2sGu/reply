import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Contact } from '../data/contact/contact.model';
import { SessionService } from './session.service';

export function useUser(): Signal<Contact | null> {
  const user$ = inject(SessionService).user$;
  return toSignal(user$, { requireSync: true });
}
