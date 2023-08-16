import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { MAIL_ACTIONS } from '@/app/entity/mail/mail.actions';

import { Mail } from '../../../entity/mail/mail.model';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent {
  private store = inject(Store);

  @Input() mail!: Mail;

  click = new EventEmitter();

  constructor() {
    this.click.subscribe(() => {
      const action = MAIL_ACTIONS.toggleMailStarredStatus({ mail: this.mail });
      this.store.dispatch(action);
    });
  }
}
