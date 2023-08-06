import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rpl-text-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-logo.component.html',
  styleUrls: ['./text-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextLogoComponent {}
