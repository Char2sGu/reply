import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import {
  distinctUntilChanged,
  endWith,
  ignoreElements,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  timer,
} from 'rxjs';

import { ScrollingModuleConfig } from './scrolling.module-config';

@Directive({
  selector: '[scrolling],[scrollStart],[scrollStop]',
})
export class ScrollStateDirective {
  @Input('scrolling') className?: string;
  @Output() scrollStart = new EventEmitter();
  @Output() scrollStop = new EventEmitter();

  scrolling$: Observable<boolean>;

  private scroll$ = new Subject<null>();

  constructor(
    private config: ScrollingModuleConfig,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {
    this.scrolling$ = this.scroll$.pipe(
      switchMap(() =>
        timer(this.config.scrollStopDelay).pipe(
          ignoreElements(),
          startWith(true),
          endWith(false),
        ),
      ),
      distinctUntilChanged(),
      shareReplay(1),
    );

    this.scrolling$.subscribe((scrolling) => {
      if (scrolling) this.scrollStart.emit();
      else this.scrollStop.emit();
    });
    this.scrollStart.subscribe(() => {
      if (this.className)
        this.renderer.addClass(
          this.elementRef.nativeElement, //
          this.className,
        );
    });
    this.scrollStop.subscribe(() => {
      if (this.className)
        this.renderer.removeClass(
          this.elementRef.nativeElement, //
          this.className,
        );
    });
  }

  @HostListener('scroll') onScroll(): void {
    this.scroll$.next(null);
  }
}
