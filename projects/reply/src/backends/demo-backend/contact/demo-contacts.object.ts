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
        email: 'express@google.com',
        avatarUrl: 'assets/demo/avatar-express.png',
      }),
      $({
        name: 'Ali Connors',
        email: 'ali.connors@gmail.com',
        avatarUrl: 'assets/demo/avatar-2.jpg',
      }),
      $({
        name: 'Sandra Adams',
        email: 'sandra.adams@gmail.com',
        avatarUrl: 'assets/demo/avatar-3.jpg',
      }),
      $({
        name: 'Trevor Hansen',
        email: 'trevor.hansen@gmail.com',
        avatarUrl: 'assets/demo/avatar-4.jpg',
      }),
      $({
        name: 'Britta Holt',
        email: 'britta.holt@gmail.com',
        avatarUrl: 'assets/demo/avatar-5.jpg',
      }),
      $({
        name: 'Josh Dillinger',
        email: 'josh.dillinger@gmail.com',
        avatarUrl: 'assets/demo/avatar-6.jpg',
      }),
      $({
        name: 'Google Play',
        email: 'play@google.com',
      }),
    ];
  },
});
