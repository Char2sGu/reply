import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDirectionDirective } from '@reply/scrolling';

import { BottomNavService } from '../main/bottom-nav/bottom-nav.service';

@Directive({
  selector: '[rplLayoutContent]',
  standalone: true,
  hostDirectives: [ScrollDirectionDirective],
})
export class LayoutContentDirective {
  private bottomNavService = inject(BottomNavService);
  private scrollDirections = inject(ScrollDirectionDirective);
  constructor() {
    this.scrollDirections.scrollUp.pipe(takeUntilDestroyed()).subscribe(() => {
      this.bottomNavService.setStatus('expanded');
    });
    this.scrollDirections.scrollDown
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.bottomNavService.setStatus('collapsed');
      });
  }
}
