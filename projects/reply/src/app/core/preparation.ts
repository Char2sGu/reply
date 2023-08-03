import { InjectionToken } from '@angular/core';
import { ObservableInput } from 'rxjs';

export const APP_PREPARER = new InjectionToken<AppPreparer[]>('APP_PREPARER');

export interface AppPreparer {
  (): ObservableInput<unknown>;
}
