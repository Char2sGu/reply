import { InjectionToken, signal, WritableSignal } from '@angular/core';

export const NAVIGATION_CONTEXT = new InjectionToken<
  WritableSignal<NavigationContext>
>('NAVIGATION_CONTEXT', {
  providedIn: 'root',
  factory: () =>
    signal({
      latestMailboxUrl: null,
      latestMailboxIndex: null,
    }),
});

export interface NavigationContext {
  latestMailboxUrl: string | null;
  latestMailboxIndex: number | null;
}
