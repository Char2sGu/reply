import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

import { useActionFlow } from '@/app/core/action-flow';
import { Mail } from '@/app/data/mail.model';
import { Mailbox } from '@/app/data/mailbox.model';

import { MoveMailActionFlow } from '../mail.action-flows';

@Component({
  selector: 'rpl-mail-action-menu-def',
  templateUrl: './mail-action-menu-def.component.html',
  styleUrls: ['./mail-action-menu-def.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionMenuDefComponent {
  moveMail = useActionFlow(MoveMailActionFlow);
  @Input({ required: true }) mail!: Mail;
  @Input() currentMailbox?: Mailbox;
  @ViewChild(MatMenu) menuRef!: MatMenu;
}
