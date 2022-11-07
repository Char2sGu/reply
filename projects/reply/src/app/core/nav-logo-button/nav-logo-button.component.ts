import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'rpl-nav-logo-button',
  templateUrl: './nav-logo-button.component.html',
  styleUrls: ['./nav-logo-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLogoButtonComponent implements OnInit {
  @Input() indicator?: TemplateRef<unknown>;
  @Input() @HostBinding('class.dense') dense = false;
  @Input() expanded = true;

  constructor() {}

  ngOnInit(): void {}
}
