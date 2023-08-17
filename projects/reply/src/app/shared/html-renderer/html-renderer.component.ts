import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';

@Component({
  selector: 'rpl-html-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './html-renderer.component.html',
  styleUrls: ['./html-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlRendererComponent {
  // prettier-ignore
  @Input({ alias: 'content', required: true })
  set contentInput(v: string) { this.content$.next(v) }
  content$ = new ReplaySubject<string>(1);

  // prettier-ignore
  @ViewChild('container')
  set containerInput(v: ElementRef<HTMLElement>) { this.container$.next(v) }
  container$ = new ReplaySubject<ElementRef<HTMLElement>>(1);

  constructor() {
    combineLatest([this.content$, this.container$]).subscribe(
      ([content, container]) => {
        container.nativeElement.innerHTML = content;
      },
    );
  }
}
