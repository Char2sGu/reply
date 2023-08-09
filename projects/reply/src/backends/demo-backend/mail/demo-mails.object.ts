/* eslint-disable max-lines-per-function */
import { InjectionToken } from '@angular/core';

import { SystemMailboxName } from '@/app/core/mailbox-name.enums';
import { Mail } from '@/app/entity/mail/mail.model';

import { useDemoEntityFactory } from '../core/demo-entity-factory';
import { DemoMailFactory } from './demo-mail-factory.service';

export const DEMO_MAILS = new InjectionToken<Mail[]>('DEMO_MAILS', {
  providedIn: 'root',
  factory: () => {
    const $ = useDemoEntityFactory(DemoMailFactory);
    return [
      $({
        subject: 'Package shipped!',
        sender: 'Google Express',
        recipients: ['<user>'],
        content: `
          Cucumber Mask Facial has shipped.
          
          Keep an eye out for a package to arrive between this Thursday and next Tuesday. If for any reason you don't receive your package before the end of next week, please reach out to us for details on your shipment.
          
          As always, thank you for shopping with us and we hope you love our specially formulated Cucumber Mask!`,
        sentAt: (now) => now.subtract(15, 'minutes'),
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Brunch this weekend?',
        sender: 'Ali Connors',
        recipients: ['<user>'],
        content: `
          I'll be in your neighborhood doing errands and was hoping to catch you for a coffee this Saturday. If you don't have anything scheduled, it would be great to see you! It feels like its been forever.
          
          If we do get a chance to get together, remind me to tell you about Kim. She stopped over at the house to say hey to the kids and told me all about her trip to Mexico.
          
          Talk to you soon,
          
          Ali`,
        sentAt: (now) => now.subtract(25, 'minutes'),
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Bonjour from Paris',
        sender: 'Sandra Adams',
        recipients: ['<user>'],
        content: `
          Here are some great shots from my trip...`,
        sentAt: (now) => now.subtract(6, 'hours'),
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'High school reunion?',
        sender: 'Trevor Hansen',
        recipients: ['<user>', 'Ali Connors', 'Sandra Adams'],
        content: `
          Hi friends,
          
          I was at the grocery store on Sunday night.. when I ran into Genie Williams! I almost didn't recognize her afer 20 years!
      
          Anyway, it turns out she is on the organizing committee for the high school reunion this fall. I don't know if you were planning on going or not, but she could definitely use our help in trying to track down lots of missing alums. If you can make it, we're doing a little phone-tree party at her place next Saturday, hoping that if we can find one person, a few more will...`,
        sentAt: (now) => now.subtract(12, 'hours'),
        isStarred: true,
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Recipe to try',
        sender: 'Britta Holt',
        recipients: ['<user>'],
        content: `
          Raspberry Pie: We should make this pie recipe tonight! The filling is very quick to put together.`,
        sentAt: (now) => now.subtract(18, 'hours'),
        isRead: true,
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Parent Teacher Conference',
        sender: 'Josh Dillinger',
        recipients: ['<user>'],
        content: `
          Dear Parent,
          
          A Parent Teacher Conference is planned for your child on Tuesday, March 3rd at 3:30pm.
      
          Please contact the school if you have any questions.`,
        sentAt: (now) => now.subtract(1, 'month').subtract(28, 'day'),
        isStarred: true,
        isRead: true,
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Brazil trip',
        sender: 'Britta Holt',
        recipients: ['<user>'],
        content: `
          Thought we might be able to go over some details about our upcoming vacation.
          
          I've been doing a bit of research and have come across a few paces in Northern Brazil that I think we should check out. One, the north has some of the most predictable wind on the planet. I'd love to get out on the ocean and kitesurf for a couple of days if we're going to be anywhere near or around Taiba. I hear it's beautiful there and if you're up for it, I'd love to go. Other than that, I haven't spent too much time looking into places along our road trip route. I'm assuming we can find places to stay and things to do as we drive and find places we think look interesting. But... I know you're more of a planner, so if you have ideas or places in mind, lets jot some ideas down!
      
          Maybe we can jump on the phone later today if you have a second.`,
        sentAt: (now) => now.subtract(9, 'hours'),
        isRead: true,
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Delivered',
        sender: 'Google Express',
        recipients: ['<user>'],
        content: `
          Your package has been delivered to the target address. For more information, please visit our official website.`,
        sentAt: (now) => now.subtract(15, 'hours'),
        mailbox: SystemMailboxName.Inbox,
      }),

      $({
        subject: 'Your update on the Google Play Store is live!',
        sender: 'Google Play',
        recipients: ['<user>'],
        content: `
          Your update is now live on the Play Store and available for your alpha users to start testing.
          
          Your alpha testers will be automatically notified. If you'd rather send them a link directly, go to your Google Play Console and follow the instructions for obtaining an open alpha testing link.`,
        sentAt: (now) => now.subtract(1, 'year').subtract(10, 'days'),
        mailbox: SystemMailboxName.Trash,
      }),
    ];
  },
});
