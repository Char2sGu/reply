import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollingModule, ScrollStateDirective } from '@reply/scrolling';

@Component({
  selector: 'rpl-scrollable-area',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './scrollable-area.component.html',
  styleUrls: ['./scrollable-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ScrollStateDirective],
})
export class ScrollableAreaComponent {
  constructor() {
    const scrollStateDirective = inject(ScrollStateDirective);
    scrollStateDirective.className = 'scrolling';
  }
}
