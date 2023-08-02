import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, from, map, Observable } from 'rxjs';

import { NAVIGATION_CONTEXT } from '../core/navigation-context.state';
import { useState } from '../core/state';

@Component({
  selector: 'rpl-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationContext = useState(NAVIGATION_CONTEXT);

  subject$ = new BehaviorSubject('');
  senderEmail$ = new BehaviorSubject(0);
  content$ = new BehaviorSubject('');

  mailId$: Observable<string> = this.route.queryParams.pipe(
    map((params) => params['reply']),
  );

  backUrl$: Observable<string>;

  constructor() {
    this.backUrl$ = combineLatest([
      this.mailId$,
      from(this.navigationContext).pipe(map((c) => c.latestMailboxUrl)),
    ]).pipe(
      map(([mailId, mailboxUrl]) =>
        mailboxUrl ? (mailId ? `${mailboxUrl}/${mailId}` : mailboxUrl) : '/',
      ),
    );
  }

  ngOnInit(): void {}
}
