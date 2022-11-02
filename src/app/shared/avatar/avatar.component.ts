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
      const options = [
        'https://xsgames.co/randomusers/avatar.php?g=male',
        'https://xsgames.co/randomusers/avatar.php?g=female',
        'assets/express.png',
      ];
      const index = Math.floor(Math.random() * options.length);
      this.src = options[index];
    }
  }
}
