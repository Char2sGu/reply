import { createFeature } from '@ngrx/store';

import { mailboxStateReducer } from './mailbox.state-reducer';

export const MAILBOX_STATE = createFeature({
  name: 'mailbox',
  reducer: mailboxStateReducer,
});
