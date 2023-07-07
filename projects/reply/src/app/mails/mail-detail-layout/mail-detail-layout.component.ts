import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';
import { LAYOUT_CONTEXT } from '@/app/core/layout-context.token';
import { ContactRepository } from '@/app/data/contact.repository';
import { Mail } from '@/app/data/mail.model';
import { MailRepository } from '@/app/data/mail.repository';

import { MailsComponent } from '../mails.component';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements AfterViewInit {
  user$ = inject(AuthenticationService).user$;
  mailRepo = inject(MailRepository);
  contactRepo = inject(ContactRepository);
  private route = inject(ActivatedRoute);
  private mailsComponent = inject(MailsComponent);
  private layoutContext = inject(LAYOUT_CONTEXT);

  mail$: Observable<Mail> = this.route.params.pipe(
    map((p): string => p['mailId']),
    switchMap((id) => this.mailRepo.retrieve(id)),
    tap((mail) => {
      if (mail.isRead) return;
      this.mailRepo.patch(mail.id, { isRead: true });
    }),
  );

  @ViewChild('replyIcon')
  private navFabIconTemplate!: TemplateRef<never>;
  private navFabConfigBackup = this.layoutContext().navFabConfig;

  @ViewChild('bottomActions')
  private navBottomActionsTemplate!: TemplateRef<never>;
  private navBottomActionsBackup = this.layoutContext().navBottomActions;

  ngAfterViewInit(): void {
    this.mailsComponent.animateLayout(300);
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
