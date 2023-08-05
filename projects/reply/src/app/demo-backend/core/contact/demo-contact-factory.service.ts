import { Injectable } from '@angular/core';

import { Contact } from '@/app/data/contact/contact.model';

import { DemoEntityFactory } from '../demo-entity-factory';

@Injectable({
  providedIn: 'root',
})
export class DemoContactFactory implements DemoEntityFactory {
  create(payload: {
    id?: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  }): Contact {
    return {
      id: payload.id ?? payload.name,
      name: payload.name,
      email: payload.email ?? this.generateEmail(payload.name),
      avatarUrl: payload.avatarUrl,
      type: 'user',
    };
  }

  private generateEmail(name: string): string {
    return name.replace(/\s+/gu, ``).toLowerCase() + `@example.com`;
  }
}
