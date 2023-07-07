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

import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { ContactRepository } from '@/app/data/contact.repository';
import { Mail } from '@/app/data/mail.model';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardComponent {
  breakpoints = inject(BREAKPOINTS);
  contactRepo = inject(ContactRepository);

  @Input({ required: true }) mail!: Mail;

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
