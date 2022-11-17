import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BreakpointManager } from '../breakpoint.manager';

@Component({
  selector: 'rpl-base-foundation',
  templateUrl: './base-foundation.component.html',
  styleUrls: ['./base-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFoundationComponent implements OnInit {
  breakpoints$ = this.breakpointManager.breakpoints$;

  constructor(private breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
