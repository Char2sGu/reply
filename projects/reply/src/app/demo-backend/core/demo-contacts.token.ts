import { InjectionToken } from '@angular/core';

import { Contact } from '@/app/data/contact.model';

import { DemoContactFactory } from './demo-contact-factory.service';
import { useDemoEntityFactory } from './demo-entity-factory';

export const DEMO_CONTACTS = new InjectionToken<Contact[]>('DEMO_CONTACTS', {
  providedIn: 'root',
  factory: () => {
    const $ = useDemoEntityFactory(DemoContactFactory);
    return [
      $({
        id: '<user>',
        name: 'Charles Gu',
        email: 'Char2s@outlook.com',
        avatarUrl: 'assets/demo/avatar-1.jpg',
      }),
      $({
        name: 'Google Express',
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
