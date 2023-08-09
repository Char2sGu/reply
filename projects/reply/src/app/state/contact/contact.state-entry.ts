import { createFeature, createSelector } from '@ngrx/store';

import { contactStateReducer } from './contact.state-reducer';

export const CONTACT_STATE = createFeature({
  name: 'contact',
  reducer: contactStateReducer,
  extraSelectors: (base) => ({
    selectCurrent: createSelector(
      base.selectCurrentId,
      base.selectContacts,
      (currentId, contacts) => {
        if (!currentId) return null;
        return contacts.retrieve(currentId);
      },
    ),
  }),
});
