import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'rpl-search-button',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
