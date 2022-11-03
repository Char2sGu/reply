import { Component, OnInit } from '@angular/core';

import { BreakpointManager } from '../core/breakpoint.manager';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
})
export class MailsComponent implements OnInit {
  constructor(public breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
