import { inject, Type } from '@angular/core';
import { Observable } from 'rxjs';

export interface ActionFlow {
  execute(payload: object): Observable<unknown>;
}

export function useActionFlow<T extends ActionFlow>(
  type: Type<T>,
): T['execute'] {
  const actionFlow = inject(type);
  return actionFlow.execute.bind(actionFlow);
}
