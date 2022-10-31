import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'rpl-mail-card',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
})
export class MailCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
