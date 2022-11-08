import * as dayjs from 'dayjs';

import { Mail } from './mail.model';

export const MAILS: Mail[] = [
  {
    id: '1',
    subject: 'Package shipped!',
    sender: {
      name: 'Google Express',
      email: '',
    },
    recipients: [],
    content: `
Cucumber Mask Facial has shipped.

Keep an eye out for a package to arrive between this Thursday and next Tuesday. If for any reason you don't receive your package before the end of next week, please reach out to us for details on your shipment.

As always, thank you for shopping with us and we hope you love our specially formulated Cucumber Mask!
`.trim(),
    sentAt: dayjs().subtract(15, 'minutes').toDate(),
    mailboxName: 'Inbox',
  },

  {
    id: '2',
    subject: 'Brunch this weekend?',
    sender: {
      name: 'Ali Connors',
      email: '',
      avatarUrl: 'assets/avatar-2.jpg',
    },
    recipients: [],
    content: `
I'll be in your neighborhood doing errands and was hoping to catch you for a coffee this Saturday. If you don't have anything scheduled, it would be great to see you! It feels like its been forever.

If we do get a chance to get together, remind me to tell you about Kim. She stopped over at the house to say hey to the kids and told me all about her trip to Mexico.

Talk to you soon,

Ali
`.trim(),
    sentAt: dayjs().subtract(4, 'hours').toDate(),
    mailboxName: 'Inbox',
  },

  {
    id: '3',
    subject: 'Bonjour from Paris',
    sender: {
      name: 'Allison Trabucco',
      email: '',
      avatarUrl: 'assets/avatar-3.jpg',
    },
    recipients: [],
    content: `
Here are some great shots from my trip...
`.trim(),
    sentAt: dayjs().subtract(5, 'hours').toDate(),
    mailboxName: 'Inbox',
  },

  {
    id: '4',
    subject: 'Brazil trip',
    sender: {
      name: 'Trevor Hansen',
      email: '',
      avatarUrl: 'assets/avatar-4.jpg',
    },
    recipients: [],
    content: `
Thought we might be able to go over some details about our upcoming vacation.

I've been doing a bit of research and have come across a few paces in Northern Brazil that I think we should check out. One, the north has some of the most predictable wind on the planet. I'd love to get out on the ocean and kitesurf for a couple of days if we're going to be anywhere near or around Taiba. I hear it's beautiful there and if you're up for it, I'd love to go. Other than that, I haven't spent too much time looking into places along our road trip route. I'm assuming we can find places to stay and things to do as we drive and find places we think look interesting. But... I know you're more of a planner, so if you have ideas or places in mind, lets jot some ideas down!

Maybe we can jump on the phone later today if you have a second.
`.trim(),
    sentAt: dayjs().subtract(9, 'hours').toDate(),
    mailboxName: 'Inbox',
  },

  {
    id: '5',
    subject: 'High school reunion?',
    sender: {
      name: 'Trevor Hansen',
      email: '',
      avatarUrl: 'assets/avatar-5.jpg',
    },
    recipients: [],
    content: `
Hi friends,

I was at the grocery store on Sunday night.. when I ran into Genie Williams! I almost didn't recognize her afer 20 years!

Anyway, it turns out she is on the organizing committee for the high school reunion this fall. I don't know if you were planning on going or not, but she could definitely use our help in trying to track down lots of missing alums. If you can make it, we're doing a little phone-tree party at her place next Saturday, hoping that if we can find one person, a few more will...
`.trim(),
    sentAt: dayjs().subtract(12, 'hours').toDate(),
    mailboxName: 'Inbox',
  },

  {
    id: '6',
    subject: 'Recipe to try',
    sender: {
      name: 'Britta Holt',
      email: '',
      avatarUrl: 'assets/avatar-6.jpg',
    },
    recipients: [],
    content: `
Raspberry Pie: We should make this pie recipe tonight! The filling is very quick to put together.
`.trim(),
    sentAt: dayjs().subtract(18, 'hours').toDate(),
    mailboxName: 'Inbox',
  },
];
