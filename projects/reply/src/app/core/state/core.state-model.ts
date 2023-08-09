import { Authorization } from '../auth/authorization.service';
import { BreakpointMap } from '../breakpoint.service';
import { ActionStatus } from './core/action-status';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  authenticationStatus: ActionStatus;
}
