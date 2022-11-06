import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Layout } from '@/app/core/layout.service';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements OnInit {
  constructor(public layout: Layout) {}

  ngOnInit(): void {}
}
