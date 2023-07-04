import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { NAVIGATION_CONTEXT } from '../core/navigation-context.token';

@Component({
  selector: 'rpl-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationContext = inject(NAVIGATION_CONTEXT);

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
      toObservable(this.navigationContext).pipe(map((c) => c.latestMailboxUrl)),
    ]).pipe(
      map(([mailId, mailboxUrl]) =>
        mailboxUrl ? (mailId ? `${mailboxUrl}/${mailId}` : mailboxUrl) : '/',
      ),
    );
  }

  ngOnInit(): void {}
}
