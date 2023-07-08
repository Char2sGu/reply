import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Contact } from '@/app/data/contact.model';

@Component({
  selector: 'rpl-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input({ required: true }) contact!: Contact;
}
