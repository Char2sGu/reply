import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { Contact } from '@/app/data/contact.model';
import { ContactService } from '@/app/data/contact.service';
import { LayoutAnimationDirective } from '@/app/layout-projection/layout-animation.directive';

import { Mail } from '../../data/mail.model';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardComponent implements OnInit {
  @Input() mail!: Mail;

  breakpoints$ = this.breakpointManager.breakpoints$;
  mailSender$!: Observable<Contact>;

  @HostBinding('class.read') get mailIsRead(): boolean {
    return this.mail.isRead;
  }

  @ViewChild('anchor') private anchorElementRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild(LayoutAnimationDirective)
  layoutAnimator!: LayoutAnimationDirective;

  constructor(
    private breakpointManager: BreakpointManager,
    private contactService: ContactService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.mailSender$ = this.contactService.getContact$ById(this.mail.sender);
    setInterval(() => {
      this.layoutAnimator.snapshot();
      this.flag = !this.flag;
      this.changeDetector.markForCheck();
      requestAnimationFrame(() => {
        this.layoutAnimator.animate();
      });
    }, 1000);
  }

  @HostBinding('class.flag') flag = false;

  @HostListener('click') onClick(): void {
    this.anchorElementRef.nativeElement.click();
  }
}
