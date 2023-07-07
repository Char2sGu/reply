import { InjectionToken } from '@angular/core';
import { ObservableInput } from 'rxjs';

export const INITIALIZER = new InjectionToken<Initializer[]>('INITIALIZERS');

export interface Initializer {
  (): ObservableInput<unknown> | void;
}
