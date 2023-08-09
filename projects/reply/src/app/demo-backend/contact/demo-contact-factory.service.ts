import { Injectable } from '@angular/core';

import { Contact } from '@/app/entity/contact/contact.model';

import { DemoEntityFactory } from '../core/demo-entity-factory';

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
    };
  }

  private generateEmail(name: string): string {
    return name.replace(/\s+/gu, ``).toLowerCase() + `@example.com`;
  }
}
