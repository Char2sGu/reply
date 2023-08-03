import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Contact } from './contact.model';
import { ContactService } from './contact.service';

export function useUser(): Signal<Contact | null> {
  const user$ = inject(ContactService).user$;
  return toSignal(user$, { initialValue: null });
}
