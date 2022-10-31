import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MailCardComponent } from '../mail-card/mail-card.component';

@Component({
  selector: 'rpl-mail-card-list',
  standalone: true,
  imports: [CommonModule, MailCardComponent],
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
})
export class MailCardListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
