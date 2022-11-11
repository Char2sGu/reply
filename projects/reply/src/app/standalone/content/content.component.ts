import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@reply/scrolling';

import { LayoutContext } from '@/app/core/layout.context';

@Component({
  selector: 'rpl-content',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  constructor(public layoutContext: LayoutContext) {}

  ngOnInit(): void {}
}
