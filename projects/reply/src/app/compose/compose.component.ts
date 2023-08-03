import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { NavigationService } from '../core/navigation.service';

@Component({
  selector: 'rpl-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent {
  private route = inject(ActivatedRoute);
  private navService = inject(NavigationService);

  subject$ = new BehaviorSubject('');
  senderEmail$ = new BehaviorSubject(0);
  content$ = new BehaviorSubject('');

  mailId$: Observable<string> = this.route.queryParams.pipe(
    map((params) => params['reply']),
  );

  // TODO: refactor to decouple from nav item details
  backUrl$ = combineLatest([
    this.mailId$,
    this.navService.activeItem$.pipe(map((i) => i?.url)),
  ]).pipe(
    map(([mailId, mailboxUrl]) => {
      if (!mailboxUrl) return '/';
      return mailId ? `${mailboxUrl}/${mailId}` : mailboxUrl;
    }),
  );
}
