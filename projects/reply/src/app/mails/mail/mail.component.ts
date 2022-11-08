import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
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
export class MailComponent implements OnInit, AfterViewInit, OnDestroy {
  mail$!: Observable<Mail>;

  private navFabConfigBackup = { ...this.layoutConfig.navFabConfig };

  @ViewChild('bottomActions')
  private bottomActionsTemplate!: TemplateRef<unknown>;
  private bottomActionsPortalBackup = this.layoutConfig.navBottomActionsPortal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutConfig: LayoutConfig,
    private mailService: MailService,
    private changeDetector: ChangeDetectorRef,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];
      this.mail$ = this.mailService
        .getMail$ById(mailId)
        .pipe(tap((mail) => this.mailService.markMailAsRead(mail)));
      this.changeDetector.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.layoutConfig.navFabConfig = {
      text: 'Reply',
      icon: 'reply_all',
      link: `${this.router.url}/reply`,
    };
    this.layoutConfig.navBottomActionsPortal = new TemplatePortal(
      this.bottomActionsTemplate,
      this.viewContainer,
    );
  }

  ngOnDestroy(): void {
    this.layoutConfig.navFabConfig = this.navFabConfigBackup;
    this.layoutConfig.navBottomActionsPortal = this.bottomActionsPortalBackup;
  }
}
