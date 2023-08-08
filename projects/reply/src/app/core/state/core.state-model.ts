import { Account } from '../../data/account/account.model';
import { Contact } from '../../data/contact/contact.model';
import { Authorization } from '../auth/authorization.service';

export interface CoreState {
  authorization: Authorization | null;
  authenticating: boolean | Error;
  user: Contact | null;
  userLoading: boolean | Error;
  account: Account | null;
  accountLoading: boolean | Error;
}
