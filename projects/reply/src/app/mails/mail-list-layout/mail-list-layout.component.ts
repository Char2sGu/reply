import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { LayoutConfig } from '@/app/core/layout.config';

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailListLayoutComponent implements OnInit {
  breakpoints$ = this.breakpointManager.breakpoints$;
  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));

  constructor(
    public layout: LayoutConfig,
    private route: ActivatedRoute,
    private breakpointManager: BreakpointManager,
  ) {}

  ngOnInit(): void {}
}
