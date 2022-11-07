import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BreakpointManager } from '../breakpoint.manager';

@Component({
  selector: 'rpl-foundation',
  templateUrl: './foundation.component.html',
  styleUrls: ['./foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationComponent implements OnInit {
  breakpoints$ = this.breakpointManager.breakpoints$;

  constructor(private breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
