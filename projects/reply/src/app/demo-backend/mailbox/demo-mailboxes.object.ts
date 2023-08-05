import { InjectionToken } from '@angular/core';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';

import { useDemoEntityFactory } from '../core/demo-entity-factory';
import { DemoMailboxFactory } from './demo-mailbox-factory.service';

export const DEMO_MAILBOXES = new InjectionToken<Mailbox[]>('DEMO_MAILBOXES', {
  providedIn: 'root',
  factory: () => {
    const $ = useDemoEntityFactory(DemoMailboxFactory);
    return [
      ...Object.values(SystemMailboxName).map((name): Mailbox => $({ name })),
      $({ name: 'Receipts' }),
      $({ name: 'Pine Elementary' }),
      $({ name: 'Taxes' }),
      $({ name: 'Vacation' }),
      $({ name: 'Mortgage' }),
      $({ name: 'Freelance' }),
    ];
  },
});
