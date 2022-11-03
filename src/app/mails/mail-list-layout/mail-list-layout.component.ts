import { Component, OnInit } from '@angular/core';
import { BreakpointManager } from 'src/app/core/breakpoint.manager';
import { Layout } from 'src/app/core/layout.service';

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
})
export class MailListLayoutComponent implements OnInit {
  constructor(
    public breakpointManager: BreakpointManager,
    public layout: Layout,
  ) {}

  ngOnInit(): void {}
}
