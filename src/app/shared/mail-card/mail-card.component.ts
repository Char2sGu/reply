import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointManager } from 'src/app/core/breakpoint.manager';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'rpl-mail-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    AvatarComponent,
  ],
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
})
export class MailCardComponent implements OnInit {
  constructor(public breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
