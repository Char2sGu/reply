import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointManager } from 'src/app/core/breakpoint.manager';

import { Mail } from '../shared/mail.model';
import { MailService } from '../shared/mail.service';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
})
export class MailCardComponent implements OnInit {
  @Input() mail!: Mail;

  breakpoints$ = this.breakpointManager.breakpoints$;

  @HostBinding('class.read') get isRead(): boolean {
    return this.mailService.isMailRead(this.mail);
  }

  @ViewChild('anchor') private anchorElementRef!: ElementRef<HTMLAnchorElement>;

  constructor(
    private breakpointManager: BreakpointManager,
    private mailService: MailService,
  ) {}

  ngOnInit(): void {}

  @HostListener('click') onClick(): void {
    this.anchorElementRef.nativeElement.click();
    this.mailService.markMailAsRead(this.mail);
  }
}
