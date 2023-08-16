import { ActionStatus } from '../../core/action-status';
import { Authorization } from '../../core/authorization.model';

export interface CoreState {
  authorization: Authorization | null;
  authenticationStatus: ActionStatus;
}
