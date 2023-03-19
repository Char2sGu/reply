import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'rpl-settings-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
