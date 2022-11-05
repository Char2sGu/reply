import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { map, pairwise, startWith, Subject } from 'rxjs';

@Directive({
  selector: '[scrollUp],[scrollDown]',
})
export class ScrollDirectionDirective {
  @Output() scrollDown = new EventEmitter();
  @Output() scrollUp = new EventEmitter();

  private scrollTop$ = new Subject<number>();
  private scrollTopDiff$ = this.scrollTop$.pipe(
    startWith(0),
    pairwise(),
    map(([prev, curr]) => curr - prev),
  );

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.scrollTopDiff$.subscribe((diff) => {
      if (diff > 0) this.scrollDown.emit();
      if (diff < 0) this.scrollUp.emit();
    });
  }

  @HostListener('scroll') onScroll(): void {
    this.scrollTop$.next(this.elementRef.nativeElement.scrollTop);
  }
}
