import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';

import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

@Component({
  selector: 'rpl-mail-card-list',
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardListComponent {
  AnimationCurves = AnimationCurves;
  @Input() mails: Mail[] = [];
  @Input() currentMailbox?: Mailbox;
  mailTracker: TrackByFunction<Mail> = (_, mail) => mail.id;
}
