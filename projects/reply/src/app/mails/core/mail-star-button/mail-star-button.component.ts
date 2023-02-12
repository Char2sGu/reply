import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, tap } from 'rxjs';

import { NavMenuItemName } from '@/app/core/nav-menu/nav-menu.component';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';
import { MailListRefreshEvent } from '../mail-list-refresh.event';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent implements OnInit {
  @Input() mail!: Mail;

  click$ = new EventEmitter();
  busy$ = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private mailRepo: MailRepository,
    private listRefresh$: MailListRefreshEvent,
  ) {}

  ngOnInit(): void {
    this.click$
      .pipe(
        filter(() => !this.busy$.value),
        tap(() => this.busy$.next(true)),
        tap(() => {
          if (this.mail.isStarred)
            this.mailRepo.update(this.mail.id, { isStarred: false });
          else this.mailRepo.update(this.mail.id, { isStarred: true });
          if (
            this.route.snapshot.params['mailboxName'] ===
            NavMenuItemName.Starred
          )
            this.listRefresh$.emit();
        }),
        tap(() => this.busy$.next(false)),
      )
      .subscribe();
  }
}
