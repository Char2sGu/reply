import { transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';

import { SharedAxisAnimation } from '../core/animations';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('route', [
      transition('list => detail', [
        SharedAxisAnimation.apply('z', 'forward', {
          incoming: ':enter rpl-content',
          outgoing: ':leave rpl-content',
        }),
      ]),
      transition('detail => list', [
        SharedAxisAnimation.apply('z', 'backward', {
          incoming: ':enter rpl-content',
          outgoing: ':leave rpl-content',
        }),
      ]),
    ]),
  ],
})
export class MailsComponent implements OnInit {
  childRouteLayoutType$!: Observable<string>;

  constructor(
    private router: Router,
    private childRouteOutletContexts: ChildrenOutletContexts,
  ) {}

  ngOnInit(): void {
    this.childRouteLayoutType$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(this.getChildRouteLayoutType()),
      map(() => this.getChildRouteLayoutType()),
    );
  }

  getChildRouteLayoutType(): string {
    const context = this.childRouteOutletContexts.getContext('primary');
    if (!context) throw new Error('No primary outlet found');
    if (!context.route) throw new Error('No route found');
    const params = context.route.snapshot.params;
    return 'mailId' in params ? 'detail' : 'list';
  }
}
