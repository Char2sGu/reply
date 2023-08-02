import { StateInjectionToken } from './state';

export const NAVIGATION_CONTEXT = new StateInjectionToken<NavigationContext>(
  'NAVIGATION_CONTEXT',
  {
    latestMailboxUrl: null,
    latestMailboxIndex: null,
  },
);

export interface NavigationContext {
  latestMailboxUrl: string | null;
  latestMailboxIndex: number | null;
}
