import {
  animate,
  animation,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { NAVIGATION_CONTEXT } from '@/app/core/navigation-context.token';
import { MailRepository } from '@/app/data/mail.repository';
import { BuiltInMailboxName, Mailbox } from '@/app/data/mailbox.model';

const mailCardsAnimation = animation([
  query(
    ':enter rpl-mail-card',
    [
      style({ opacity: 0 }),
      stagger(25, [
        animate(`225ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ opacity: 1 }),
      ]),
    ],
    { optional: true },
  ),
]);

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('content', [
      transition(':enter', [useAnimation(mailCardsAnimation)]),
      transition(':increment', [
        group([
          SharedAxisAnimation.apply('y', 'forward'),
          useAnimation(mailCardsAnimation),
        ]),
      ]),
      transition(':decrement', [
        group([
          SharedAxisAnimation.apply('y', 'backward'),
          useAnimation(mailCardsAnimation),
        ]),
      ]),
    ]),
  ],
  host: {
    ['[@content]']: 'navigationContext().latestMailboxIndex',
  },
})
export class MailListLayoutComponent {
  AnimationCurves = AnimationCurves;
  breakpoints = inject(BREAKPOINTS);
  navigationContext = inject(NAVIGATION_CONTEXT);
  private route = inject(ActivatedRoute);
  private mailRepo = inject(MailRepository);

  mailbox$ = this.route.data.pipe(map((data): Mailbox => data['mailbox']));

  mails$ = this.mailbox$.pipe(
    switchMap((mailbox) =>
      this.mailRepo.query(
        mailbox.name === BuiltInMailboxName.Starred
          ? (e) => e.isStarred
          : (e) => e.mailbox === mailbox.id,
      ),
    ),
    map((mails) =>
      mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
    ),
  );
}
