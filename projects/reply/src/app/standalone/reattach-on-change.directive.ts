import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Remove and Reattach the template when the value changes, so that we can
 * implement some awesome animations.
 *
 * Inspired from {@link https://stackblitz.com/edit/angular-8-reappear-animation-text-value-changes?file=src/app/app.component.ts IgorKurkov's Stackblitz}
 */
@Directive({
  selector: '[rplReattachOnChange]',
  standalone: true,
})
export class ReattachOnChangeDirective {
  private initialized = false;
  private valueCurrent?: unknown;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<never>,
  ) {}

  @Input('rplReattachOnChange') set value(value: unknown) {
    if (value === this.valueCurrent) return;
    this.valueCurrent = value;

    if (!this.initialized) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.initialized = true;
      return;
    }

    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
