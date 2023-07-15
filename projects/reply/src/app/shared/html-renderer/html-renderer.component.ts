import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'rpl-html-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './html-renderer.component.html',
  styleUrls: ['./html-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlRendererComponent implements OnChanges {
  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  @Input({ required: true }) content!: string;

  ngOnChanges(): void {
    const shadowRoot = this.element.shadowRoot;
    if (!shadowRoot) throw new Error('Missing ShadowRoot');
    shadowRoot.innerHTML = this.content;
  }
}
