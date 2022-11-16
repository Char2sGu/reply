import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { NavigationContext } from '../core/navigation.context';

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

  mailId$: Observable<string> = this.route.queryParams.pipe(
    map((params) => params['reply']),
  );

  backUrl$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private navigationContext: NavigationContext,
  ) {
    this.backUrl$ = combineLatest([
      this.mailId$,
      this.navigationContext.value$.pipe(
        map((context) => context.latestMailboxUrl),
      ),
    ]).pipe(
      map(([mailId, mailboxUrl]) =>
        mailboxUrl ? (mailId ? `${mailboxUrl}/${mailId}` : mailboxUrl) : '/',
      ),
    );
  }

  ngOnInit(): void {}
}
