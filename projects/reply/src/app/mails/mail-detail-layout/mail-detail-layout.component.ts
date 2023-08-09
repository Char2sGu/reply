import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, delay, first } from 'rxjs';

import { VirtualMailboxName } from '@/app/core/mailbox-name.enums';
import { CONTACT_STATE } from '@/app/core/state/contact/contact.state-entry';
import { ContactRepository } from '@/app/data/contact/contact.repository';
import { Mail } from '@/app/data/mail/mail.model';
import { MailRepository } from '@/app/data/mail/mail.repository';
import { Mailbox } from '@/app/data/mailbox/mailbox.model';
import { BottomNavService } from '@/app/main/bottom-nav/bottom-nav.service';
import { NavFabService } from '@/app/main/nav-fab/nav-fab.service';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements AfterViewInit, OnDestroy {
  private store = inject(Store);

  mailRepo = inject(MailRepository);
  contactRepo = inject(ContactRepository);
  private route = inject(ActivatedRoute);
  private bottomNavService = inject(BottomNavService);
  private navFabService = inject(NavFabService);

  user = this.store.selectSignal(CONTACT_STATE.selectCurrent);

  private viewInit = new EventEmitter();
  ngAfterViewInit(): void {
    this.viewInit.emit();
    this.viewInit.complete();
  }

  private destroy = new EventEmitter();
  ngOnDestroy(): void {
    this.destroy.emit();
    this.destroy.complete();
  }

  @Input({ required: true }) mail!: Mail;
  @Input({ required: true }) mailbox!: Mailbox | VirtualMailboxName;

  get mailboxAsEntity(): Mailbox | undefined {
    return typeof this.mailbox === 'object' ? this.mailbox : undefined;
  }

  @ViewChild('replyIcon')
  private navFabIconTemplate!: TemplateRef<never>;
  @ViewChild('bottomActions')
  private navBottomActionsTemplate!: TemplateRef<never>;

  constructor() {
    this.viewInit.pipe(delay(0)).subscribe(() => {
      this.bottomNavService.useActions(this.navBottomActionsTemplate);
      this.navFabService.useConfig({
        text: 'Reply',
        icon: this.navFabIconTemplate,
        link: '/compose',
        linkParams: { reply: this.route.snapshot.params['mailId'] },
      });
    });

    combineLatest([
      this.bottomNavService.actions$.pipe(first()),
      this.navFabService.config$.pipe(first()),
      this.destroy.pipe(delay(0)),
    ]).subscribe(([bottomNavActionsBackup, navFabConfigBackup]) => {
      this.bottomNavService.useActions(bottomNavActionsBackup);
      this.navFabService.useConfig(navFabConfigBackup);
    });
  }
}
