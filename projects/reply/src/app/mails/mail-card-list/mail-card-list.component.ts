import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { FlipScopeConfig } from '@/app/flip/flip-scope.directive';

import { Mail } from '../core/mail.model';
import { MailService } from '../core/mail.service';

@Component({
  selector: 'rpl-mail-card-list',
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardListComponent implements OnInit {
  mails$!: Observable<Mail[]>;
  mailTracker: TrackByFunction<Mail> = (_, mail) => mail.id;

  flipConfig: FlipScopeConfig = {
    duration: 225,
    easing: AnimationCurves.STANDARD_CURVE,
  };

  constructor(
    private route: ActivatedRoute,
    private mailService: MailService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailboxName = params['mailboxName'];
      this.mails$ =
        mailboxName === 'Starred'
          ? this.mailService.getMailsStarred$()
          : this.mailService.getMails$ByMailbox(mailboxName);
      this.changeDetector.detectChanges();
    });
  }
}
