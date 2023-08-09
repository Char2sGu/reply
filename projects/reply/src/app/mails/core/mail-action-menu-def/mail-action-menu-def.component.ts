import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

import { useActionFlow } from '@/app/core/action-flow';
import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import {
  MoveMailActionFlow,
  ToggleMailReadStatusActionFlow,
} from '../mail.action-flows';

@Component({
  selector: 'rpl-mail-action-menu-def',
  templateUrl: './mail-action-menu-def.component.html',
  styleUrls: ['./mail-action-menu-def.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionMenuDefComponent {
  moveMail = useActionFlow(MoveMailActionFlow);
  toggleMailReadStatus = useActionFlow(ToggleMailReadStatusActionFlow);
  @Input({ required: true }) mail!: Mail;
  @Input() currentMailbox?: Mailbox;
  @ViewChild(MatMenu) menuRef!: MatMenu;
}
