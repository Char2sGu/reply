import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  concat,
  debounceTime,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { Mail } from '../core/mail.model';
import { MailService } from '../core/mail.service';
import { MailboxContext } from '../core/mailbox.context';

@Component({
  selector: 'rpl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  backUrl$!: Observable<string>;
  searchText$ = new BehaviorSubject('');
  mails$!: Observable<Mail[]>;

  constructor(
    private mailboxContext: MailboxContext,
    private mailService: MailService,
  ) {}

  ngOnInit(): void {
    this.backUrl$ = this.mailboxContext.value$.pipe(
      map((context) => context.current),
      map((mailbox) => (mailbox ? `/mailboxes/${mailbox}/mails` : '/')),
    );
    this.mails$ = concat(
      this.searchText$.pipe(first()),
      this.searchText$.pipe(debounceTime(200)),
    ).pipe(
      map((text) => text.split(' ')),
      switchMap((keywords) => this.mailService.getMails$ByKeywords(keywords)),
    );
  }
}
