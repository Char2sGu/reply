import { createFeature } from '@ngrx/store';

import { mailStateReducer } from './mail.state-reducer';

export const MAIL_STATE = createFeature({
  name: 'mail',
  reducer: mailStateReducer,
});
