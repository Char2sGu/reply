import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rpl-search-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
})
export class SearchButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
