import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, startWith, Subject } from 'rxjs';

import { NavMenuItemName } from '@/app/core/nav-menu/nav-menu.component';

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

  private refresh$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private mailRepo: MailRepository,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.refresh$.pipe(startWith(null)),
    ]).subscribe(([params]) => {
      const mailboxName = params['mailboxName'];

      this.mails$ = (
        mailboxName === NavMenuItemName.Starred
          ? this.mailRepo.listStarred()
          : this.mailRepo.listByMailbox(mailboxName)
      ).pipe(
        map((mails) =>
          mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
        ),
      );

      this.changeDetector.markForCheck();
    });
  }

  refresh(): void {
    this.refresh$.next();
  }
}
