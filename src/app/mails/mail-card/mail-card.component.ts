import { Component, OnInit } from '@angular/core';
import { BreakpointManager } from 'src/app/core/breakpoint.manager';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
})
export class MailCardComponent implements OnInit {
  constructor(public breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
