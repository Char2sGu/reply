import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { Mail } from '../core/mail.model';
import { MailService } from '../core/mail.service';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit {
  mail$!: Observable<Mail>;

  constructor(
    private route: ActivatedRoute,
    private mailService: MailService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];
      this.mail$ = this.mailService
        .getMailById(mailId)
        .pipe(tap((mail) => this.mailService.markMailAsRead(mail)));
      this.changeDetector.detectChanges();
    });
  }
}
