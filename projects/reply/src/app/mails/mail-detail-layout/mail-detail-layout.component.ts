import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import { AuthenticationService } from '@/app/core/authentication.service';
import { LAYOUT_CONTEXT } from '@/app/core/layout-context.token';
import { ContactRepository } from '@/app/data/contact.repository';
import { Mail } from '@/app/data/mail.model';
import { MailRepository } from '@/app/data/mail.repository';

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
  private layoutContext = inject(LAYOUT_CONTEXT);

  @Input({ required: true }) mail!: Mail;

  @ViewChild('replyIcon')
  private navFabIconTemplate!: TemplateRef<never>;
  private navFabConfigBackup = this.layoutContext().navFabConfig;

  @ViewChild('bottomActions')
  private navBottomActionsTemplate!: TemplateRef<never>;
  private navBottomActionsBackup = this.layoutContext().navBottomActions;

  ngAfterViewInit(): void {
    timer(0).subscribe(() => {
      this.layoutContext.mutate((c) => {
        c.navFabConfig = {
          text: 'Reply',
          icon: this.navFabIconTemplate,
          link: '/compose',
          linkParams: { reply: this.route.snapshot.params['mailId'] },
        };
        c.navBottomActions = this.navBottomActionsTemplate;
      });
    });
  }

  ngOnDestroy(): void {
    timer(0).subscribe(() => {
      this.layoutContext.mutate((c) => {
        c.navFabConfig = this.navFabConfigBackup;
        c.navBottomActions = this.navBottomActionsBackup;
      });
    });
  }
}
