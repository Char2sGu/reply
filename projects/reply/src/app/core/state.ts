import { inject, InjectionToken, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, InteropObservable } from 'rxjs';

export class StateInjectionToken<T> extends InjectionToken<BehaviorSubject<T>> {
  type?: T;
  constructor(name: string, initialValue: T) {
    super(name, {
      providedIn: 'root',
      factory: () => new BehaviorSubject<T>(initialValue),
    });
  }
}

export interface State<T> extends Signal<T>, InteropObservable<T> {}

export function useState<T>(token: StateInjectionToken<T>): State<T> {
  const source = inject<BehaviorSubject<T>>(token);
  const signal = toSignal(source, { initialValue: source.value });
  return Object.assign(signal, { [Symbol.observable]: () => source });
}

export interface WritableState<T>
  extends State<T>,
    Pick<WritableSignal<T>, 'set' | 'update' | 'mutate'> {}

export function useWritableState<T>(
  token: StateInjectionToken<T>,
): WritableState<T> {
  const source = inject<BehaviorSubject<T>>(token);
  const state = useState(token);
  return Object.assign(state, {
    set: (value) => source.next(value),
    update: (updateFn) => source.next(updateFn(source.value)),
    mutate: (mutateFn) => {
      mutateFn(source.value);
      source.next(source.value);
    },
  } satisfies Omit<Pick<WritableState<T>, keyof WritableState<T>>, keyof State<T>>);
}
