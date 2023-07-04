import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';
import { LAYOUT_CONTEXT } from '@/app/core/layout-context.token';
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
  private route = inject(ActivatedRoute);
  private layoutContext = inject(LAYOUT_CONTEXT);
  private auth = inject(AuthenticationService);
  private mailRepo = inject(MailRepository);
  private contactRepo = inject(ContactRepository);
  private changeDetector = inject(ChangeDetectorRef);

  mail$!: Observable<Mail>;
  mailSender$!: Observable<Contact>;
  mailRecipientNames$!: Observable<string[]>;

  @ViewChild('replyIcon')
  private navFabIconTemplate!: TemplateRef<never>;
  private navFabConfigBackup = this.layoutContext().navFabConfig;

  @ViewChild('bottomActions')
  private navBottomActionsTemplate!: TemplateRef<never>;
  private navBottomActionsBackup = this.layoutContext().navBottomActions;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];

      // TODO: cleaner implementation

      this.mail$ = this.mailRepo.retrieve(mailId).pipe(
        tap((mail) => {
          if (mail.isRead) return;
          this.mailRepo.patch(mail.id, { isRead: true });
        }),
      );

      this.mailSender$ = this.mail$.pipe(
        switchMap((mail) => this.contactRepo.retrieve(mail.sender)),
      );

      const mailRecipients$ = this.mail$.pipe(
        switchMap((mail) =>
          combineLatest(
            mail.recipients.map((id) => this.contactRepo.retrieve(id)),
          ),
        ),
      );

      this.mailRecipientNames$ = combineLatest([
        mailRecipients$,
        this.auth.user$,
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
    this.layoutContext.mutate((c) => {
      c.navFabConfig = {
        text: 'Reply',
        icon: this.navFabIconTemplate,
        link: '/compose',
        linkParams: { reply: this.route.snapshot.params['mailId'] },
      };
      c.navBottomActions = this.navBottomActionsTemplate;
    });
  }

  ngOnDestroy(): void {
    this.layoutContext.mutate((c) => {
      c.navFabConfig = this.navFabConfigBackup;
      c.navBottomActions = this.navBottomActionsBackup;
    });
  }
}
