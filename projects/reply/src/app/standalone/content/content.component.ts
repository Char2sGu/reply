import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@reply/scrolling';

import { Layout } from '@/app/core/layout.service';

@Component({
  selector: 'rpl-content',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  constructor(public layout: Layout) {}

  ngOnInit(): void {}
}
