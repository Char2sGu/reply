import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LayoutConfig } from '@/app/core/layout.config';

import { Mail } from '../core/mail.model';
import { MailService } from '../core/mail.service';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit, OnDestroy {
  mail$!: Observable<Mail>;

  private navFabConfigBackup = { ...this.layoutConfig.navFabConfig };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutConfig: LayoutConfig,
    private mailService: MailService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.layoutConfig.navFabConfig = {
      text: 'Reply',
      icon: 'reply_all',
      link: `${this.router.url}/reply`,
    };
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];
      this.mail$ = this.mailService
        .getMailById(mailId)
        .pipe(tap((mail) => this.mailService.markMailAsRead(mail)));
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.layoutConfig.navFabConfig = this.navFabConfigBackup;
  }
}
