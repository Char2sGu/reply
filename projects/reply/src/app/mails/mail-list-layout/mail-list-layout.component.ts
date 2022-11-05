import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointManager } from 'projects/reply/src/app/core/breakpoint.manager';
import { Layout } from 'projects/reply/src/app/core/layout.service';
import { map } from 'rxjs';

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
})
export class MailListLayoutComponent implements OnInit {
  breakpoints$ = this.breakpointManager.breakpoints$;
  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));

  constructor(
    public layout: Layout,
    private route: ActivatedRoute,
    private breakpointManager: BreakpointManager,
  ) {}

  ngOnInit(): void {}
}
