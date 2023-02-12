import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Mail } from '../../data/mail.model';
import { MailRepository } from '../../data/mail.repository';

@Component({
  selector: 'rpl-mail-card-list',
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardListComponent implements OnInit {
  AnimationCurves = AnimationCurves;

  mails$!: Observable<Mail[]>;
  mailTracker: TrackByFunction<Mail> = (_, mail) => mail.id;
  mailPrevId$ = this.route.queryParams.pipe(map((params) => params['prev']));

  constructor(
    private route: ActivatedRoute,
    private mailService: MailRepository,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailboxName = params['mailboxName'];

      this.mails$ = (
        mailboxName === 'Starred'
          ? this.mailService.getMails$Starred()
          : this.mailService.getMails$ByMailbox(mailboxName)
      ).pipe(
        map((mails) =>
          mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
        ),
      );

      this.changeDetector.markForCheck();
    });
  }
}
