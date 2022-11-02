import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rpl-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input()
  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  size?: number;

  @Input()
  src?: string;

  constructor() {}

  ngOnInit(): void {
    if (!this.src) {
      const num = Math.floor(Math.random() * 6);
      this.src = `assets/avatar-${num ? `${num}.jpg` : 'express.png'}`;
    }
  }
}
