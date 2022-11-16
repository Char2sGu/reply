import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { MailboxContext } from '../core/mailbox.context';

@Component({
  selector: 'rpl-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent implements OnInit {
  subject$ = new BehaviorSubject('');
  senderEmail$ = new BehaviorSubject(0);
  content$ = new BehaviorSubject('');

  backUrl$!: Observable<string>;

  constructor(private mailboxContext: MailboxContext) {}

  ngOnInit(): void {
    this.backUrl$ = this.mailboxContext.value$.pipe(
      map((context) => context.current),
      map((mailbox) => (mailbox ? `/mailboxes/${mailbox}/mails` : '/')),
    );
  }
}
