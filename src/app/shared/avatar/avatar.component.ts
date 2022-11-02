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

  constructor() {}

  ngOnInit(): void {}
}
