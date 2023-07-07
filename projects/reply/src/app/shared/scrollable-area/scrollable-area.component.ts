import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ScrollingModule } from '@reply/scrolling';

import { LAYOUT_CONTEXT } from '@/app/core/layout-context.token';

@Component({
  selector: 'rpl-scrollable-area',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './scrollable-area.component.html',
  styleUrls: ['./scrollable-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableAreaComponent {
  layoutContext = inject(LAYOUT_CONTEXT);

  @ViewChild('wrapper') private wrapper!: ElementRef<HTMLElement>;
  private scrolledManually = false;

  /**
   * Imitate the layout of the specified scrollTop with overflowing content
   * visible.
   *
   * Might be useful for animations.
   *
   * @param scrollTop
   */
  fakeScroll(scrollTop: number): void {
    // We need to correct the scrollTop because the value might be greater
    // than the maximum scrollTop and we won't be able to fake the actual
    // scroll behavior if that happens.
    this.setScrollTop(scrollTop);
    scrollTop = this.getScrollTop();

    const wrapper = this.wrapper.nativeElement;
    wrapper.style.overflow = 'visible';
    wrapper.style.position = 'relative';
    wrapper.style.top = `${-scrollTop}px`;
  }

  getScrollTop(): number {
    return this.wrapper.nativeElement.scrollTop;
  }

  setScrollTop(scrollTop?: number): void {
    const wrapper = this.wrapper.nativeElement;
    wrapper.style.overflow = '';
    wrapper.style.position = '';
    wrapper.style.top = '';
    if (scrollTop !== undefined) wrapper.scrollTop = scrollTop;
    this.scrolledManually = true;
  }

  onScroll(direction: 'up' | 'down'): void {
    // TODO: is it really good to put the logic here?
    if (this.scrolledManually) {
      this.scrolledManually = false;
      return;
    }
    if (direction === 'up')
      this.layoutContext.mutate((c) => (c.contentFavored = false));
    else this.layoutContext.mutate((c) => (c.contentFavored = true));
  }
}
