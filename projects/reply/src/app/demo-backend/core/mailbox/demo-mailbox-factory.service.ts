import { Injectable } from '@angular/core';

import { Mailbox } from '@/app/data/mailbox.model';

import { DemoEntityFactory } from '../demo-entity-factory';

@Injectable({
  providedIn: 'root',
})
export class DemoMailboxFactory implements DemoEntityFactory {
  create(payload: { id?: string; name: string }): Mailbox {
    return {
      id: payload.id ?? payload.name,
      name: payload.name,
    };
  }
}
