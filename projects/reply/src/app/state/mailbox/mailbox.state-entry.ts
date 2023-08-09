import { createFeature, createSelector } from '@ngrx/store';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { mailboxStateReducer } from './mailbox.state-reducer';

export const MAILBOX_STATE = createFeature({
  name: 'mailbox',
  reducer: mailboxStateReducer,
  extraSelectors: (base) => ({
    selectSystemMailboxesIndexedByName: createSelector(
      base.selectMailboxes,
      (collection) => {
        const names: string[] = Object.values(SystemMailboxName);
        const mailboxes = collection.query((m) => names.includes(m.name));
        const mapping: Partial<Record<SystemMailboxName, Mailbox>> = {};
        for (const name of Object.values(SystemMailboxName)) {
          const mailbox = mailboxes.find((m) => m.name === name);
          if (!mailbox) throw new Error(`Missing mailbox "${name}"`);
          mapping[name] = mailbox;
        }
        return mapping as Required<typeof mapping>;
      },
    ),
  }),
});
