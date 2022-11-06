import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { LayoutConfig } from '@/app/core/layout.config';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements OnInit {
  constructor(public layout: LayoutConfig) {}

  ngOnInit(): void {}
}
