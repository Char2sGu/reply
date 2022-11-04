import { Component, Input, OnInit } from '@angular/core';
import { BreakpointManager } from 'src/app/core/breakpoint.manager';

import { Mail } from '../shared/mail.model';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
})
export class MailCardComponent implements OnInit {
  @Input() mail!: Mail;

  constructor(public breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
