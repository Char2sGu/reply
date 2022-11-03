import { Component, OnInit } from '@angular/core';

import { BreakpointManager } from '../core/breakpoint.manager';
import { Layout } from '../core/layout.service';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
})
export class MailsComponent implements OnInit {
  constructor(
    public breakpointManager: BreakpointManager,
    public layout: Layout,
  ) {}

  ngOnInit(): void {}
}
