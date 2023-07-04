import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { Contact } from '@/app/data/contact.model';
import { ContactRepository } from '@/app/data/contact.repository';

import { Mail } from '../../data/mail.model';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardComponent implements OnInit {
  breakpoints = inject(BREAKPOINTS);
  private contactRepo = inject(ContactRepository);

  @Input() mail!: Mail;

  mailSender$!: Observable<Contact>;

  @HostBinding('class.read') get mailIsRead(): boolean {
    return this.mail.isRead;
  }
  @HostBinding('class.starred') get mailIsStared(): boolean {
    return this.mail.isStarred;
  }

  @ViewChild('anchor') private anchorElementRef!: ElementRef<HTMLAnchorElement>;

  ngOnInit(): void {
    this.mailSender$ = this.contactRepo.retrieve(this.mail.sender);
  }

  @HostListener('click') onClick(): void {
    this.anchorElementRef.nativeElement.click();
  }
}
