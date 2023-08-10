import { Authorization } from '../core/auth/authorization.model';
import { BreakpointMap } from '../core/breakpoint.service';
import { ActionStatus } from './core/action-status';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  authenticationStatus: ActionStatus;
}
