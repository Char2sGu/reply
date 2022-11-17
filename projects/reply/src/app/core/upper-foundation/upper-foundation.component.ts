import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'rpl-upper-foundation',
  templateUrl: './upper-foundation.component.html',
  styleUrls: ['./upper-foundation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpperFoundationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
