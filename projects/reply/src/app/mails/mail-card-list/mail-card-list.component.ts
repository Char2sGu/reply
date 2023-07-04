import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutAnimationScopeRef } from '@layout-projection/angular';
import { combineLatest, map, Observable, startWith } from 'rxjs';

import { NavMenuItemName } from '@/app/core/nav-menu/nav-menu.component';

import { Mail } from '../../data/mail.model';
import { MailRepository } from '../../data/mail.repository';
import { MailListRefreshEvent } from '../core/mail-list-refresh.event';

@Component({
  selector: 'rpl-mail-card-list',
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardListComponent implements OnInit {
  AnimationCurves = AnimationCurves;

  @Input() animationScope?: LayoutAnimationScopeRef;

  mails$!: Observable<Mail[]>;
  mailTracker: TrackByFunction<Mail> = (_, mail) => mail.id;
  mailPrevId$ = this.route.queryParams.pipe(map((params) => params['prev']));

  constructor(
    private route: ActivatedRoute,
    private mailRepo: MailRepository,
    private changeDetector: ChangeDetectorRef,
    private refresh$: MailListRefreshEvent,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.refresh$.pipe(startWith(null)),
    ]).subscribe(([params]) => {
      const mailboxName = params['mailboxName'];

      this.mails$ = this.mailRepo
        .query(
          mailboxName === NavMenuItemName.Starred
            ? (e) => e.isStarred
            : (e) => e.mailboxName === mailboxName,
        )
        .pipe(
          map((mails) =>
            mails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
          ),
        );

      this.changeDetector.markForCheck();
    });
  }
}
