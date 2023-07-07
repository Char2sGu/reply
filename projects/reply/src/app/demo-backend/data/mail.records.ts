import dayjs from 'dayjs/esm';

import { Mail } from '../../data/mail.model';

export const MAILS: readonly Mail[] = [
  {
    id: '1',
    subject: 'Package shipped!',
    sender: '1',
    recipients: ['user'],
    content: `
Cucumber Mask Facial has shipped.

Keep an eye out for a package to arrive between this Thursday and next Tuesday. If for any reason you don't receive your package before the end of next week, please reach out to us for details on your shipment.

As always, thank you for shopping with us and we hope you love our specially formulated Cucumber Mask!
`.trim(),
    sentAt: dayjs().subtract(15, 'minutes').toDate(),
    isStarred: false,
    isRead: false,
    mailboxName: 'Inbox',
  },

  {
    id: '2',
    subject: 'Brunch this weekend?',
    sender: '2',
    recipients: ['user'],
    content: `
I'll be in your neighborhood doing errands and was hoping to catch you for a coffee this Saturday. If you don't have anything scheduled, it would be great to see you! It feels like its been forever.

If we do get a chance to get together, remind me to tell you about Kim. She stopped over at the house to say hey to the kids and told me all about her trip to Mexico.

Talk to you soon,

Ali
`.trim(),
    sentAt: dayjs().subtract(25, 'minutes').toDate(),
    isStarred: false,
    isRead: false,
    mailboxName: 'Inbox',
  },

  {
    id: '3',
    subject: 'Bonjour from Paris',
    sender: '3',
    recipients: ['user'],
    content: `
Here are some great shots from my trip...
`.trim(),
    sentAt: dayjs().subtract(6, 'hours').toDate(),
    isStarred: false,
    isRead: false,
    mailboxName: 'Inbox',
  },

  {
    id: '4',
    subject: 'High school reunion?',
    sender: '4',
    recipients: ['user', '2', '3'],
    content: `
Hi friends,

I was at the grocery store on Sunday night.. when I ran into Genie Williams! I almost didn't recognize her afer 20 years!

Anyway, it turns out she is on the organizing committee for the high school reunion this fall. I don't know if you were planning on going or not, but she could definitely use our help in trying to track down lots of missing alums. If you can make it, we're doing a little phone-tree party at her place next Saturday, hoping that if we can find one person, a few more will...
`.trim(),
    sentAt: dayjs().subtract(12, 'hours').toDate(),
    isStarred: true,
    isRead: false,
    mailboxName: 'Inbox',
  },

  {
    id: '5',
    subject: 'Recipe to try',
    sender: '5',
    recipients: ['user'],
    content: `
Raspberry Pie: We should make this pie recipe tonight! The filling is very quick to put together.
`.trim(),
    sentAt: dayjs().subtract(18, 'hours').toDate(),
    isStarred: false,
    isRead: true,
    mailboxName: 'Inbox',
  },

  {
    id: '6',
    subject: 'Parent Teacher Conference',
    sender: '6',
    recipients: ['user'],
    content: `
Dear Parent,

A Parent Teacher Conference is planned for your child on Tuesday, March 3rd at 3:30pm.

Please contact the school if you have any questions.
`.trim(),
    sentAt: dayjs().subtract(1, 'month').subtract(28, 'day').toDate(),
    isStarred: true,
    isRead: true,
    mailboxName: 'Inbox',
  },

  {
    id: '7',
    subject: 'Brazil trip',
    sender: '5',
    recipients: ['user'],
    content: `
Thought we might be able to go over some details about our upcoming vacation.

I've been doing a bit of research and have come across a few paces in Northern Brazil that I think we should check out. One, the north has some of the most predictable wind on the planet. I'd love to get out on the ocean and kitesurf for a couple of days if we're going to be anywhere near or around Taiba. I hear it's beautiful there and if you're up for it, I'd love to go. Other than that, I haven't spent too much time looking into places along our road trip route. I'm assuming we can find places to stay and things to do as we drive and find places we think look interesting. But... I know you're more of a planner, so if you have ideas or places in mind, lets jot some ideas down!

Maybe we can jump on the phone later today if you have a second.
  `.trim(),
    sentAt: dayjs().subtract(9, 'hours').toDate(),
    isStarred: false,
    isRead: true,
    mailboxName: 'Inbox',
  },

  {
    id: '8',
    subject: 'Delivered',
    sender: '1',
    recipients: ['user'],
    content: `
Your package has been delivered to the target address. For more information, please visit our official website.
  `.trim(),
    sentAt: dayjs().subtract(15, 'hours').toDate(),
    isStarred: false,
    isRead: false,
    mailboxName: 'Inbox',
  },

  {
    id: '9',
    subject: 'Your update on the Google Play Store is live!',
    sender: '7',
    recipients: ['user'],
    content: `
Your update is now live on the Play Store and available for your alpha users to start testing.

Your alpha testers will be automatically notified. If you'd rather send them a link directly, go to your Google Play Console and follow the instructions for obtaining an open alpha testing link.
`.trim(),
    sentAt: dayjs().subtract(1, 'year').subtract(10, 'days').toDate(),
    isStarred: false,
    isRead: false,
    mailboxName: 'Trash',
  },
];
