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
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '@/app/core/auth.service';
import { LayoutContext } from '@/app/core/layout.context';
import { Contact } from '@/app/data/contact.model';
import { ContactRepository } from '@/app/data/contact.repository';

import { Mail } from '../../data/mail.model';
import { MailRepository } from '../../data/mail.repository';

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
    private layoutContext: LayoutContext,
    private authService: AuthService,
    private mailService: MailRepository,
    private contactService: ContactRepository,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];

      // TODO: cleaner implementation

      this.mail$ = this.mailService.retrieve(mailId).pipe(
        tap((mail) => {
          if (mail.isRead) return;
          this.mailService.update(mail.id, { isRead: true });
        }),
      );

      this.mailSender$ = this.mail$.pipe(
        switchMap((mail) => this.contactService.retrieve(mail.sender)),
      );

      const mailRecipients$ = this.mail$.pipe(
        switchMap((mail) =>
          combineLatest(
            mail.recipients.map((id) => this.contactService.retrieve(id)),
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
      link: '/compose',
      linkParams: { reply: this.route.snapshot.params['mailId'] },
    };
    this.layoutContext.navBottomActions = this.navBottomActionsTemplate;
  }

  ngOnDestroy(): void {
    this.layoutContext.navFabConfig = this.navFabConfigBackup;
    this.layoutContext.navBottomActions = this.navBottomActionsBackup;
  }
}
