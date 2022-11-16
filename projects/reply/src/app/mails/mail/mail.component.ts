import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '@/app/core/auth.service';
import { Contact } from '@/app/core/contact.model';
import { ContactService } from '@/app/core/contact.service';
import { LayoutContext } from '@/app/core/layout.context';

import { Mail } from '../../core/mail.model';
import { MailService } from '../../core/mail.service';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit, AfterViewInit, OnDestroy {
  mail$!: Observable<Mail>;
  mailSender$!: Observable<Contact>;
  mailRecipientNames$!: Observable<string[]>;

  @ViewChild('replyIcon')
  private navFabIconTemplate!: TemplateRef<never>;
  private navFabConfigBackup = this.layoutContext.navFabConfig;

  @ViewChild('bottomActions')
  private navBottomActionsTemplate!: TemplateRef<never>;
  private navBottomActionsBackup = this.layoutContext.navBottomActions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutContext: LayoutContext,
    private authService: AuthService,
    private mailService: MailService,
    private contactService: ContactService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];

      // TODO: cleaner implementation

      this.mail$ = this.mailService.getMail$ById(mailId).pipe(
        tap((mail) => {
          if (mail.isRead) return;
          this.mailService.updateMail(mail.id, { isRead: true });
        }),
      );

      this.mailSender$ = this.mail$.pipe(
        switchMap((mail) => this.contactService.getContact$ById(mail.sender)),
      );

      const mailRecipients$ = this.mail$.pipe(
        switchMap((mail) =>
          combineLatest(
            mail.recipients.map((id) =>
              this.contactService.getContact$ById(id),
            ),
          ),
        ),
      );

      this.mailRecipientNames$ = combineLatest([
        mailRecipients$,
        this.authService.getUser$(),
      ]).pipe(
        map(([recipients, user]) =>
          recipients
            .map((item) => (item.id === user.id ? 'me' : item.name))
            .sort((a, b) => {
              if (a === 'me') return -Infinity;
              if (b === 'me') return Infinity;
              return a.localeCompare(b);
            }),
        ),
      );

      this.changeDetector.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.layoutContext.navFabConfig = {
      text: 'Reply',
      icon: this.navFabIconTemplate,
      link: `${this.router.url}/reply`,
    };
    this.layoutContext.navBottomActions = this.navBottomActionsTemplate;
  }

  ngOnDestroy(): void {
    this.layoutContext.navFabConfig = this.navFabConfigBackup;
    this.layoutContext.navBottomActions = this.navBottomActionsBackup;
  }
}
