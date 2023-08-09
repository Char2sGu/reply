import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';
import { Store } from '@ngrx/store';

import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';
import { MAIL_ACTIONS } from '@/app/state/mail/mail.actions';

@Component({
  selector: 'rpl-mail-action-menu-def',
  templateUrl: './mail-action-menu-def.component.html',
  styleUrls: ['./mail-action-menu-def.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionMenuDefComponent {
  private store = inject(Store);

  moveMailButtonClick = new EventEmitter();
  toggleMailReadStatusButtonClick = new EventEmitter();

  @Input({ required: true }) mail!: Mail;
  @Input() currentMailbox?: Mailbox;
  @ViewChild(MatMenu) menuRef!: MatMenu;

  constructor() {
    this.moveMailButtonClick.subscribe(() => {
      // TODO: implement
      throw new Error('Not implemented');
    });
    this.toggleMailReadStatusButtonClick.subscribe(() => {
      const action = MAIL_ACTIONS.toggleMailReadStatus({ mail: this.mail });
      this.store.dispatch(action);
    });
  }
}
