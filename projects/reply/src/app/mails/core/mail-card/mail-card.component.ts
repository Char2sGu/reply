import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ContactRepository } from '@/app/entity/contact/contact.repository';
import { Mail } from '@/app/entity/mail/mail.model';
import { Mailbox } from '@/app/entity/mailbox/mailbox.model';
import { CORE_STATE } from '@/app/state/core.state-entry';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardComponent {
  private store = inject(Store);
  contactRepo = inject(ContactRepository);

  breakpoints = this.store.selectSignal(CORE_STATE.selectBreakpoints);

  @Input({ required: true }) mail!: Mail;
  @Input() currentMailbox?: Mailbox;

  @HostBinding('class.read') get mailIsRead(): boolean {
    return this.mail.isRead;
  }
  @HostBinding('class.starred') get mailIsStared(): boolean {
    return this.mail.isStarred;
  }

  @ViewChild('anchor') private anchorElementRef!: ElementRef<HTMLAnchorElement>;

  @HostListener('click') onClick(): void {
    this.anchorElementRef.nativeElement.click();
  }
}
