import { InjectionToken } from '@angular/core';

import { Contact } from '@/app/entity/contact/contact.model';

import { useDemoEntityFactory } from '../core/demo-entity-factory';
import { DemoContactFactory } from './demo-contact-factory.service';

export const DEMO_CONTACTS = new InjectionToken<Contact[]>('DEMO_CONTACTS', {
  providedIn: 'root',
  factory: () => {
    const $ = useDemoEntityFactory(DemoContactFactory);
    return [
      $({
        id: '<user>',
        name: 'Demo User',
        email: 'demo@reply.io',
        avatarUrl: 'assets/demo/avatar-1.jpg',
      }),
      $({
        name: 'Google Express',
        avatarUrl: 'assets/demo/avatar-express.png',
      }),
      $({
        name: 'Ali Connors',
        avatarUrl: 'assets/demo/avatar-2.jpg',
      }),
      $({
        name: 'Sandra Adams',
        avatarUrl: 'assets/demo/avatar-3.jpg',
      }),
      $({
        name: 'Trevor Hansen',
        avatarUrl: 'assets/demo/avatar-4.jpg',
      }),
      $({
        name: 'Britta Holt',
        avatarUrl: 'assets/demo/avatar-5.jpg',
      }),
      $({
        name: 'Josh Dillinger',
        avatarUrl: 'assets/demo/avatar-6.jpg',
      }),
      $({
        name: 'Google Play',
      }),
    ];
  },
});
