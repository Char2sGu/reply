import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'rpl-mail-avatar',
  templateUrl: './mail-avatar.component.html',
  styleUrls: ['./mail-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailAvatarComponent implements OnInit {
  @Input() src?: string;

  constructor() {}

  ngOnInit(): void {}
}
